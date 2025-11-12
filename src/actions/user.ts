'use server'

import { currentUser } from '@clerk/nextjs/server'
import { client } from '@/lib/prisma'
import nodemailer from 'nodemailer'

export const sendEmail = async (
  to: string,
  subject: string,
  text: string,
  html?: string
) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.MAILER_EMAIL,
      pass: process.env.MAILER_PASSWORD,
    },
  })

  const mailOptions = {
    to,
    subject,
    text,
    html,
  }
  return { transporter, mailOptions }
}

export const onAuthenticateUser = async () => {
  try {
    const user = await currentUser()
    if (!user) {
      return { status: 403, message: 'User not authenticated' }
    }

    const userExists = await client.user.findUnique({
      where: {
        clerkid: user.id,
      },
      include: {
        workspace: {
          where: {
            User: {
              clerkid: user.id,
            },
          },
        },
      },
    })

    if (userExists) {
      return { status: 200, user: userExists }
    }

    const newUser = await client.user.create({
      data: {
        clerkid: user.id,
        email: user.emailAddresses[0].emailAddress,
        firstname: user.firstName,
        lastname: user.lastName,
        image: user.imageUrl,
        studio: {
          create: {},
        },
        subscription: {
          create: {},
        },
        workspace: {
          create: {
            name: user.firstName + "'s Workspace",
            type: 'PERSONAL',
          },
        },
      },
      include: {
        workspace: true,
        subscription: {
          select: {
            plan: true,
          },
        },
      },
    })

    if (newUser) {
      return { status: 201, user: newUser }
    }

    return { status: 400, message: 'Failed to create user' }
  } catch (error) {
    console.error('Authentication error:', error)
    return { status: 500, message: 'Internal server error' }
  }
}

export const getNotifications = async () => {
  try {
    const user = await currentUser()
    if (!user) return { status: 403 }

    const notifications = await client.user.findUnique({
      where: {
        clerkid: user.id,
      },
      select: {
        notification: true,
        _count: {
          select: {
            notification: true,
          },
        },
      },
    })
    if (notifications && notifications.notification.length > 0)
      return { status: 200, data: notifications }

    return { status: 404, data: [] }
  } catch (error) {
    return { status: 400, data: [] }
  }
}

export const searchUsers = async (query: string) => {
  try {
    const user = await currentUser()
    if (!user) return { status: 403, data: [] }

    const users = await client.user.findMany({
      where: {
        OR: [
          { firstname: { contains: query, mode: 'insensitive' } },
          { lastname: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } },
        ],
        NOT: [{ clerkid: user.id }],
      },
      select: {
        id: true,
        subscription: {
          select: {
            plan: true,
          },
        },
        firstname: true,
        lastname: true,
        image: true,
        email: true,
      },
    })
    if (users && users.length > 0) return { status: 200, data: users }
    return { status: 404, data: undefined }
  } catch (error) {
    return { status: 500, data: undefined }
  }
}

export const getUserProfile = async () => {
  try {
    const user = await currentUser()
    if (!user) return { status: 404 }
    const profileIdAndImage = await client.user.findUnique({
      where: {
        clerkid: user.id,
      },
      select: {
        id: true,
        image: true,
      },
    })
    if (profileIdAndImage) return { status: 200, data: profileIdAndImage }
    return { status: 404 }
  } catch (error) {
    return { status: 500 }
  }
}

export const getVideoComments = async (Id: string) => {
  try {
    const comments = await client.comment.findMany({
      where: {
        OR: [{ videoId: Id }, { commentId: Id }],
        commentId: null,
      },
      include: {
        reply: {
          include: {
            User: true,
          },
        },
        User: true,
      },
    })
    return { status: 200, data: comments }
  } catch (error) {
    return { status: 500 }
  }
}

export const createCommentAndReply = async (
  userId: string,
  comment: string,
  videoId: string,
  commentId?: string
) => {
  try {
    if (commentId) {
      const reply = await client.comment.update({
        where: {
          id: commentId,
        },
        data: {
          reply: {
            create: {
              comment,
              userId,
              videoId,
            },
          },
        },
      })
      if (reply) return { status: 200, data: 'Reply posted' }
      return { status: 404 }
    }

    const newComment = await client.video.update({
      where: {
        id: videoId,
      },
      data: {
        Comment: {
          create: {
            comment,
            userId,
          },
        },
      },
    })
    if (newComment) return { status: 200, data: 'New comment added' }
    return { status: 404 }
  } catch (error) {
    return { status: 500 }
  }
}

export const getPaymentInfo = async () => {
  try {
    const user = await currentUser()
    if (!user) return { status: 403 }

    const paymentInfo = await client.user.findUnique({
      where: {
        clerkid: user.id,
      },
      select: {
        subscription: {
          select: {
            plan: true,
          },
        },
      },
    })
    if (paymentInfo) return { status: 200, data: paymentInfo }
    return { status: 404 }
  } catch (error) {
    return { status: 500 }
  }
}

export const enableFirstView = async (state: boolean) => {
  try {
    const user = await currentUser()
    if (!user) return { status: 403 }

    const userData = await client.user.update({
      where: {
        clerkid: user.id,
      },
      data: {
        firstView: state,
      },
    })
    if (userData) return { status: 200, data: 'Settings updated' }
    return { status: 404 }
  } catch (error) {
    return { status: 500 }
  }
}

export const getFirstView = async () => {
  try {
    const user = await currentUser()
    if (!user) return { status: 403 }

    const userData = await client.user.findUnique({
      where: {
        clerkid: user.id,
      },
      select: {
        firstView: true,
      },
    })
    if (userData) return { status: 200, data: userData.firstView }
    return { status: 404 }
  } catch (error) {
    return { status: 500 }
  }
}

export const inviteMembers = async (
  workspaceId: string,
  recieverId: string,
  email: string
) => {
  try {
    const user = await currentUser()
    if (!user) return { status: 401 }
    const senderInfo = await client.user.findUnique({
      where: { clerkid: user.id },
      select: {
        id: true,
        firstname: true,
        lastname: true,
      },
    })
    if (senderInfo?.id) {
      const workspace = await client.workSpace.findUnique({
        where: {
          id: workspaceId,
        },
        select: {
          name: true,
        },
      })
      if (workspace) {
        const invitation = await client.invite.create({
          data: {
            senderId: senderInfo.id,
            recieverId,
            workSpaceId: workspaceId,
            content: `You have been invited to join ${workspace.name} workspace, click accept to confirm`,
          },
          select: {
            id: true,
          },
        })

        await client.user.update({
          where: {
            clerkid: user.id,
          },
          data: {
            notification: {
              create: {
                content: `${user.firstName} ${user.lastName} invited ${senderInfo.firstname} into ${workspace.name}`,
              },
            },
          },
        })
        if (invitation) {
          const { transporter, mailOptions } = await sendEmail(
            email,
            'You got an invitation',
            `You are invited to join ${workspace.name} Workspace, click accept to confirm`,
            `<a href="${process.env.NEXT_PUBLIC_HOST_URL}/invite/${invitation.id}" style="background-color: #fff; padding: 10px 20px; border-radius: 10px;">Accept Invite</a>`
          )

          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.log('🔴', error.message)
            } else {
              console.log('✅ Email sent: ' + info.response)
            }
          })
          return { status: 200, data: 'Invitation sent' }
        }
        return { status: 400, data: 'Invitation failed' }
      }
      return { status: 404, data: 'Workspace not found' }
    }
    return { status: 404, data: 'Recipient not found' }
  } catch (error) {
    console.log(error)
    return { status: 500, data: 'Oops! something went wrong' }
  }
}

export const acceptInvite = async (inviteId: string) => {
  try {
    const user = await currentUser()
    if (!user) return { status: 404, data: 'Unauthorized' }

    const invitation = await client.invite.findUnique({
      where: {
        id: inviteId,
      },
      select: {
        workSpaceId: true,
        reciever: {
          select: {
            clerkid: true,
          },
        },
      },
    })

    if (!invitation) return { status: 404, data: 'Invitation not found' }

    if (user.id !== invitation.reciever?.clerkid) {
      return { status: 401, data: 'Unauthorized' }
    }

    // Check if user is already a member of the workspace
    const existingMember = await client.member.findFirst({
      where: {
        User: {
          clerkid: user.id,
        },
        workSpaceId: invitation.workSpaceId,
      },
    })

    if (existingMember) {
      return {
        status: 409,
        data: 'You are already a member of this workspace',
      }
    }

    const acceptInvite = client.invite.update({
      where: {
        id: inviteId,
      },
      data: {
        accepted: true,
      },
    })

    const updateMember = client.user.update({
      where: {
        clerkid: user.id,
      },
      data: {
        members: {
          create: {
            workSpaceId: invitation.workSpaceId,
          },
        },
      },
    })

    const membersTransaction = await client.$transaction([
      acceptInvite,
      updateMember,
    ])

    if (membersTransaction) {
      return {
        status: 200,
        data: 'Successfully joined workspace',
      }
    }

    return {
      status: 400,
      data: 'Failed to join workspace',
    }
  } catch (error) {
    console.error('Error accepting invite:', error)
    return {
      status: 500,
      data: 'Internal server error',
    }
  }
}

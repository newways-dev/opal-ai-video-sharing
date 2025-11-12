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

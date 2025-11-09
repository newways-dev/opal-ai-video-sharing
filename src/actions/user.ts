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

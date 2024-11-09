"use server";
import db from "@/lib/db";
import getSession from "@/lib/session";
export async function saveMessage(payload: string, chatRoomId: string) {
  const session = await getSession();
  const message = await db.message.create({
    data: {
      payload,
      chatRoomId,
      userId: session.id!,
    },
    select: {
      id: true,
    },
  });
}

export async function updateMessagesAsRead(chatRoomId: string, userId: number) {
  const unreadMessages = await db.message.findMany({
    where: {
      chatRoomId,
      userId: {
        not: userId,
      },
      isRead: false,
    },
  });

  // isRead가 false인 messages를 찾아서 isRead를 true로 수정
  if (unreadMessages.length > 0) {
    await db.message.updateMany({
      where: {
        chatRoomId,
        userId: {
          not: userId,
        },
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });
  }
}

export async function updateProductState(
  productId: number,
  state: number,
  buyerId: number | undefined
) {
  if (state === 1) {
    await db.product.update({
      where: {
        id: productId,
      },
      data: {
        state,
        buyerId: null,
      },
    });
  } else if (state === 2) {
    await db.product.update({
      where: {
        id: productId,
      },
      data: {
        state,
        buyerId,
      },
    });
  } else if (state === 3) {
    await db.product.update({
      where: {
        id: productId,
      },
      data: {
        state,
        buyerId,
      },
    });
    const product = await db.product.findUnique({
      where: {
        id: productId,
      },
    });
    const existingSale = await db.sale.findUnique({
      where: {
        id: {
          productId,
          userId: product?.userId!,
        },
      },
    });

    if (!existingSale) {
      await db.sale.create({
        data: {
          userId: product?.userId!,
          productId,
          purchaseId: product?.buyerId!,
        },
      });
    }
    const exisetingPurchase = await db.purchase.findUnique({
      where: {
        id: {
          productId,
          userId: product?.buyerId!,
        },
      },
    });
    if (!exisetingPurchase) {
      await db.purchase.create({
        data: {
          userId: product?.buyerId!,
          productId,
          saleId: product?.userId!,
        },
      });
    }
  }
}

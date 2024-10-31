"use server";

import db from "@/lib/db";
import getSession from "@/lib/session";

export async function getMoreProducts(page: number) {
  const products = await db.product.findMany({
    select: {
      title: true,
      price: true,
      created_at: true,
      photo: true,
      id: true,
    },
    skip: page * 1,
    take: 5,
    orderBy: {
      created_at: "desc",
    },
  });
  return products;
}

export async function getMoreProductsLoved(page: number) {
  const session = await getSession();
  const favs = await db.fav.findMany({
    where: {
      userId: session.id,
    },
    include: {
      product: {
        select: {
          id: true,
        },
      },
    },
  });
  const productIds = favs.map((fav) => fav.product.id);
  const products = await db.product.findMany({
    where: {
      id: {
        in: productIds,
      },
    },
    select: {
      title: true,
      price: true,
      created_at: true,
      photo: true,
      id: true,
    },
    skip: page * 1,
    take: 5,
    orderBy: {
      created_at: "desc",
    },
  });
  return products;
}

export async function getMoreProductsSold(page: number) {
  const session = await getSession();
  const sales = await db.sale.findMany({
    where: {
      userId: session.id,
    },
    include: {
      product: {
        select: {
          id: true,
        },
      },
    },
  });
  const productIds = sales.map((sale) => sale.product.id);
  const products = await db.product.findMany({
    where: {
      id: {
        in: productIds,
      },
    },
    select: {
      title: true,
      price: true,
      created_at: true,
      photo: true,
      id: true,
    },
    skip: page * 1,
    take: 5,
    orderBy: {
      created_at: "desc",
    },
  });
  return products;
}
export async function getMoreProductsBought(page: number) {
  const session = await getSession();
  const purchases = await db.purchase.findMany({
    where: {
      userId: session.id,
    },
    include: {
      product: {
        select: {
          id: true,
        },
      },
    },
  });
  const productIds = purchases.map((purchase) => purchase.product.id);
  const products = await db.product.findMany({
    where: {
      id: {
        in: productIds,
      },
    },
    select: {
      title: true,
      price: true,
      created_at: true,
      photo: true,
      id: true,
    },
    skip: page * 1,
    take: 5,
    orderBy: {
      created_at: "desc",
    },
  });
  return products;
}

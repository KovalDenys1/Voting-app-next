import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Получаем все партии
    const parties = await prisma.party.findMany();

    // Получаем количество голосов по каждой партии
    const voteCounts = await prisma.vote.groupBy({
      by: ["partyId"],
      _count: {
        partyId: true,
      },
    });

    // Создаём карту partyId => количество голосов
    const countMap = new Map<string, number>(
      voteCounts.map(vc => [vc.partyId, vc._count.partyId])
    );

    // Формируем массив результатов
    const results = parties
      .map(party => ({
        party: { name: party.name },
        count: countMap.get(party.id) || 0,
      }))
      .sort((a, b) => b.count - a.count); // сортировка по убыванию голосов

    // Отправляем результат
    return res.status(200).json({ results });

  } catch (error: unknown) {
    const err = error as Error;
    console.error("💥 Error in /api/results:", err);
    return res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
}
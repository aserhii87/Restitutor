import type { Goods } from "./Goods";

export type TradeOfferBase =
   | { theyOffer: Goods; weOffer: Goods }
   | { theyOffer: "gold"; weOffer: Goods }
   | { theyOffer: Goods; weOffer: "gold" };

export type TradeOffer = TradeOfferBase & { theyOfferAmount: number; weOfferAmount: number };

export type ActiveTrade = TradeOffer & { monthsLeft: number };

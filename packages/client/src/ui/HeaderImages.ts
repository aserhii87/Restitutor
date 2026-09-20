import BarbarianRaid from "../assets/images/headers/BarbarianRaid.webp";
import ChristianEmpire from "../assets/images/headers/ChristianEmpire.webp";
import Chronicle from "../assets/images/headers/ChronicleHeader.webp";
import Crisis from "../assets/images/headers/Crisis.webp";
import EcumenicalCouncil from "../assets/images/headers/EcumenicalCouncil.webp";
import Peace from "../assets/images/headers/Peace.webp";
import Rebirth from "../assets/images/headers/Rebirth.webp";
import Senate from "../assets/images/headers/Senate.webp";
import Tetrarchy from "../assets/images/headers/Tetrarchy.webp";
import Treasury from "../assets/images/headers/Treasury.webp";
import type { ImageWithCredit } from "../game/events/ImageWithCredit";

export const HeaderImages = {
   BarbarianRaid: { url: BarbarianRaid, credit: "Alexander and Darius at Issus, Anton Hoffmann (1920)" },
   Senate: { url: Senate, credit: "Cicero's tale about Catiline, Hans Werner Schmidt (1912)" },
   EcumenicalCouncil: {
      url: EcumenicalCouncil,
      credit: "Saint Ambrose barring Theodosius from Milan Cathedral, Anthony van Dyck (c.1620)",
   },
   Chronicle: { url: Chronicle, credit: "Das Forum Romanum, J. Bühlmann (1901)" },
   Rebirth: { url: Rebirth, credit: "Le triomphe de la Ville de Paris, François-Edouard Picot (1842)" },
   Treasury: { url: Treasury, credit: "Ancient Rome, Giovanni Paolo Panini (1757)" },
   Crisis: { url: Crisis, credit: "The Fall of Pompeii, Anton Hoffmann (1920)" },
   ChristianEmpire: { url: ChristianEmpire, credit: "The Baptism of Constantine, Gianfrancesco Penni (c.1520)" },
   Tetrarchy: {
      url: Tetrarchy,
      credit: "Cross-section of the Baths of Diocletian, Edmond Jean-Baptiste Paulin (1880)",
   },
   Peace: {
      url: Peace,
      credit: "Vercingetorix surrenders to Julius Caesar, Alphonse Marie de Neuville (French, 1835-1885)",
   },
} as const satisfies Record<string, ImageWithCredit>;

// Live preview for the site. Same months, days and colors as the reference
// video, with sample text and placeholder images.
import "@fontsource-variable/figtree";
import { CalendarSeries, type CalendarEntry } from "@/components/CalendarSeries";
import desk from "./images/desk.jpg";
import photo1 from "./images/photo-1.jpg";
import photo2 from "./images/photo-2.jpg";
import sketch from "./images/sketch.jpg";

const entries: CalendarEntry[] = [
  {
    date: "2024-02-05",
    color: "#2cca8b",
    category: "Misc",
    title: "Weekend sketches",
    body: (
      <p>
        I spent the weekend testing a new drawing app. The brushes feel great, and{" "}
        <a href="#">the color tools</a> are really fun. Highly recommend.
      </p>
    ),
    images: [{ src: sketch, alt: "Colorful sketch", aspect: 4 / 3 }],
  },
  {
    date: "2024-02-14",
    color: "#2eb2f6",
    category: "Misc",
    title: "Dinner with friends",
    body: <p>Small table, long talks, too much pasta. A good night.</p>,
  },
  {
    date: "2024-02-15",
    color: "#5599f7",
    category: "Blog",
    title: "Notes on small tools",
    body: <p>The tools I use every day are the simple ones. A short list of what stayed.</p>,
    link: { label: "Read the full post", href: "#" },
  },
  {
    date: "2024-01-12",
    color: "#5599f7",
    category: "Blog",
    title: "My desk 🪴",
    body: <p>My desk is my favorite place. It took a long time to get it right, and I enjoyed each step.</p>,
    images: [{ src: desk, alt: "Wooden desk with a laptop", aspect: 16 / 9 }],
    imagePosition: "top",
    link: { label: "Get cozy and read more", href: "#" },
  },
  {
    date: "2024-01-20",
    color: "#e26cf5",
    category: "Music",
    title: "On repeat",
    body: <p>One album, all week. It sounds better every time.</p>,
  },
  {
    date: "2024-01-23",
    color: "#9c7ef7",
    category: "Misc",
    title: "First snow",
    body: <p>The whole street went quiet this morning.</p>,
  },
  {
    date: "2023-12-31",
    color: "#25cbb5",
    category: "Photos",
    images: [
      { src: photo1, alt: "Photo placeholder", aspect: 4 / 3 },
      { src: photo2, alt: "Photo placeholder", aspect: 4 / 3 },
    ],
  },
];

export default function CalendarSeriesPreview() {
  return (
    <div className="w-full font-['Figtree_Variable',sans-serif]">
      {/* Page background from the reference. */}
      <div aria-hidden="true" className="fixed inset-0 -z-10 bg-[#f2f2f2]" />
      <CalendarSeries entries={entries} />
    </div>
  );
}

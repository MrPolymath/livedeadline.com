import Link from "next/link";

export default function HowTo() {
  return (
    <main className="h-screen p-6 pt-20 relative text-slate-800 bg-slate-100">
      <div className="absolute top-0 left-0 p-4 pl-6 text-gray-500">
        <Link href="/">Home</Link>
      </div>
      {/* Explain how to setup the new tab in Chrome as a specific url */}
      <h1 className="text-2xl font-bold">How to use</h1>
      <p className="mt-4">
        Use this however you want. Most commonly, this would be shown in a
        screen in the office, permanently reminding you how fast time is passing
        by.
      </p>
      <p className="mt-4">
        Another way to use it is to make it the default new tab page, so you can
        see the countdown every time you open a new tab. The main issue is that
        it would unfocus the searchbar, which is very annoying.
      </p>
      <p className="mt-4">
        You could also set it up as the page that opens on the browser on
        startup. You will see it less often though, especially if you are one of
        those that never closes the browser.
      </p>
    </main>
  );
}

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="flex flex-col justify-center items-center gap-4 pb-4">
      <div>
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Tour connect. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

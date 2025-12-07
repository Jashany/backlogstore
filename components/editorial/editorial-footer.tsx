'use client';

import Link from 'next/link';

export const EditorialFooter = () => {
  return (
    <footer className="bg-white text-black py-10 md:py-12 px-4 md:px-12 text-xs tracking-widest flex flex-col md:flex-row justify-between items-center gap-6 border-t border-black/10">
      <div className="flex flex-col gap-2 items-center md:items-start">
        <p className="uppercase">© 2025 BACKLOG. ALL RIGHTS RESERVED.</p>
        <div className="flex gap-4 text-black/40">
          <Link href="#" className="hover:text-black transition-colors uppercase">
            Privacy
          </Link>
          <Link href="#" className="hover:text-black transition-colors uppercase">
            Terms
          </Link>
          <Link href="#" className="hover:text-black transition-colors uppercase">
            Cookies
          </Link>
        </div>
      </div>
      <div className="text-black/30 uppercase tracking-[0.2em]">
        Designed for the Underground
      </div>
    </footer>
  );
};

export default EditorialFooter;

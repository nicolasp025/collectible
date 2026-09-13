import { loginUrl } from '../api/auth'

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-rgx-bg px-4 text-center text-rgx-text">
      <span className="flex items-center font-heading text-[18px] font-bold tracking-[0.06em] sm:text-[22px]">
        <img src="/favicon.svg" alt="" className="mr-2.5 h-6 w-6" />
        <span className="mr-1">RGX</span>
        <span className="text-rgx-accent">// NOVA</span>
      </span>

      <a
        href={loginUrl}
        className="flex cursor-pointer items-center gap-2 border-none bg-rgx-accent px-5 py-3 font-heading text-[13px] font-semibold tracking-[0.04em] text-rgx-bg [clip-path:polygon(0_0,100%_0,100%_100%,12px_100%,0_calc(100%-12px))]"
      >
        SE CONNECTER AVEC GOOGLE
      </a>
    </div>
  )
}

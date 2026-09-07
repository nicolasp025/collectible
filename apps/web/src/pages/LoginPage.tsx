import { loginUrl } from '../api/auth'

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-rgx-bg px-4 text-center text-rgx-text">
      <span className="font-heading text-[18px] font-bold tracking-[0.06em] sm:text-[22px]">
        <span className="mr-2.5 inline-block h-3.5 w-3.5 -translate-y-px bg-rgx-accent [clip-path:polygon(0_0,100%_0,100%_60%,60%_100%,0_100%)]" />
        RGX <span className="text-rgx-accent">// COLLECTIBLE</span>
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

export default function AppDownload() {
  return (
    <section
      className="
        relative overflow-hidden
        py-20 md:py-28 px-5
        bg-gradient-to-b from-slate-50 to-white
      "
    >
      {/* subtle background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[520px] h-[520px] bg-blue-500/10 blur-3xl rounded-full" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">

          {/* RIGHT - Mobile дээр эхэнд харагдана */}
          <div className="flex justify-center lg:justify-end relative lg:order-2">
            <div className="absolute -inset-10 bg-blue-500/5 blur-3xl rounded-full" />

            <img
              src="/App.svg"
              alt="Mobile App"
              className="
                relative z-10
                w-full max-w-md
                drop-shadow-[0_40px_80px_rgba(0,0,0,0.12)]
                transition-transform duration-500
                hover:-translate-y-1
              "
            />
          </div>

          {/* LEFT */}
          <div className="flex flex-col gap-8 text-center lg:text-left lg:order-1">

            {/* Scattered headline */}
            <div className="relative min-h-[300px] md:min-h-[340px]">
              <span className="absolute top-6 left-0 lg:left-4 text-5xl md:text-6xl font-extrabold text-slate-900 rotate-[-2deg]">
                Манай
              </span>

              <span className="absolute top-24 left-14 lg:left-20 text-6xl md:text-7xl font-extrabold text-emerald-300 rotate-[3deg]">
                апп-аар
              </span>

              <span className="absolute top-44 left-0 lg:left-8 text-4xl md:text-5xl font-extrabold text-gray-900 rotate-[-1deg]">
                илүү хялбар,
              </span>

              <span className="absolute top-60 left-20 lg:left-36 text-5xl md:text-6xl font-extrabold text-slate-900 rotate-[2deg]">
                хурдан
              </span>
            </div>

            {/* Features */}
            <div className="flex flex-col gap-4 mt-2">
              {[
                '24/7 зээлийн мэдээлэл шалгах',
                'Хаанаас ч төлбөр төлөх',
                'Хурдан зээлийн хүсэлт илгээх',
                'Нууцлал, аюулгүй байдал',
              ].map((text) => (
                <div key={text} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center">
                    <span className="text-blue-600 text-sm font-semibold">✓</span>
                  </div>
                  <span className="text-slate-700 text-sm sm:text-base">
                    {text}
                  </span>
                </div>
              ))}
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-6 justify-center lg:justify-start">

              {/* App Store */}
              <button
                className="
                  flex items-center justify-center gap-3
                  px-6 py-3.5 rounded-xl
                  bg-emerald-300 text-white
                  font-medium
                  transition-all duration-300
                  shadow-md hover:shadow-lg
                  border border-emerald-300/40
                  hover:bg-white/60
                  hover:text-slate-900
                  hover:backdrop-blur-md
                  hover:border hover:border-white/40
                "
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
                App Store
              </button>

              {/* Google Play */}
              <button
                className="
                  flex items-center justify-center gap-3
                  px-6 py-3.5 rounded-xl
                  border border-slate-200
                  text-slate-800
                  font-medium
                  hover:bg-slate-100
                  transition-all
                "
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 0 1 0 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.802 8.99l-2.303 2.303-8.635-8.635z" />
                </svg>
                Google Play
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

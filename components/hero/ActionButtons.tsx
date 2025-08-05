import { heroData } from "@/data/home/hero-data"
import Link from "next/link"

const ActionButtons = ()=>{
      const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

    return(
        <>
         <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-6 px-2">
          <button onClick={() => scrollToSection("game-frame")} className="btn-primary text-lg sm:text-xl md:text-2xl jello w-full sm:w-auto">
            {heroData.buttons.primary}
          </button>
          <Link
            href="/games"
            className="btn-secondary text-lg sm:text-xl md:text-2xl jello w-full sm:w-auto"
            style={{ animationDelay: "0.5s" }}
          >
            {heroData.buttons.secondary}
          </Link>
        </div>
        </>
    )
}


export default ActionButtons
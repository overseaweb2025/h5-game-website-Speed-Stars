import { Award, Clock, Zap, Users } from "lucide-react"
import Image from "next/image"

interface GameplaySectionProps {
  t?: any;
}

export default function GameplaySection({ t }: GameplaySectionProps = {}) {
  return (
    <section id="gameplay" className="py-6 md:py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-6">
          <h2 className="text-white mb-2 font-black text-shadow-lg">
            {t?.gameplaySection?.speedStarsGameplay || "Speed Stars Gameplay"}
          </h2>
          <p className="text-gray-200 max-w-3xl mx-auto text-lg font-medium">
            Speed Stars is a rhythm racing game in which players aim to conquer the championship. Master the track, one
            step at a time, where every millisecond counts!
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-6 mb-6">
          <div className="md:w-1/2">
            <div className="relative rounded-xl overflow-hidden shadow-xl">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/speed-stars-256-WkiY3oyGGYwPUIiBOFmpVGgoN2Y4vu.webp"
                alt={t?.hero?.speedStarUnblocked || "Speed Stars gameplay showing runners racing on a red track with time display"}
                width={800}
                height={450}
                className="w-full h-auto"
              />
            </div>
          </div>

          <div className="md:w-1/2">
            <h3 className="text-2xl font-bold mb-3 text-white">Race Against the Clock</h3>
            <p className="mb-3 text-gray-200">
              Every race is a test of precision and timing. Watch your split times, perfect your rhythm, and shave
              milliseconds off your personal best. In Speed Stars, the difference between victory and defeat can be just
              0.055 seconds!
            </p>
            <p className="text-gray-200">
              Compete in 100m sprints, 200m races, and other track events against AI opponents or real players from
              around the world. The realistic physics engine makes every step count - one misstep can cost you the gold!
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="card">
            <h3 className="text-xl font-bold mb-3 flex items-center text-white">
              <Zap className="mr-2 text-primary h-6 w-6" /> {t?.gameplaySection?.controlsAndMechanics || "Controls & Mechanics"}
            </h3>
            <p className="mb-3 text-gray-200">
              Players control a sprinter by tapping alternately on the keys or the edges of the screen to simulate foot
              movements. The challenge is to synchronize your tap rhythm with the runner's stride to maintain momentum
              and avoid falling.
            </p>
            <div className="p-3 rounded-lg bg-gray-700/30">
              <h4 className="font-bold mb-1 text-white">{t?.gameplaySection?.controlGuide || "Control Guide:"}:</h4>
              <ul className="space-y-1 text-gray-200">
                <li>• Left Arrow – Move left leg</li>
                <li>• Right Arrow – Move right leg</li>
                <li>• Up Arrow – Lean forward</li>
                <li>• Down Arrow – Lean backward</li>
              </ul>
            </div>
          </div>

          <div className="card">
            <h3 className="text-xl font-bold mb-3 flex items-center text-white">
              <Clock className="mr-2 text-primary h-6 w-6" /> {t?.gameplaySection?.raceTypesAndChallenges || "Race Types & Challenges"}
            </h3>
            <p className="mb-3 text-gray-200">
              Races range from 40-meter sprints to the iconic 100-meter sprint, and each run requires precise
              coordination and quick reflexes. The game also features replay and hidden run options, allowing players to
              race against their previous best or global top players.
            </p>
            <p className="text-gray-200">
              Every stride demands precise timing and perfect balance as you face off against tough competitors. Speed
              alone won't win the race—only flawless rhythm and form under pressure will carry you to the finish line.
            </p>
          </div>

          <div className="card">
            <h3 className="text-xl font-bold mb-3 flex items-center text-white">
              <Award className="mr-2 text-primary h-6 w-6" /> {t?.gameplaySection?.trainHardWinBig || "Train Hard, Win Big"}
            </h3>
            <p className="mb-3 text-gray-200">
              The game allows you to train your athlete, improve their performance, and compete across multiple
              distances. From the iconic 100-meter dash to more complex tracks filled with obstacles, each event tests
              your timing and coordination.
            </p>
            <p className="text-gray-200">
              Analyze replays to uncover mistakes, sharpen your technique, and crush personal bests with every run.
              Whether you're chasing perfection in solo mode or battling friends in thrilling 2-player races, this
              creative running game keeps your heart pounding.
            </p>
          </div>

          <div className="card">
            <h3 className="text-xl font-bold mb-3 flex items-center text-white">
              <Users className="mr-2 text-primary h-6 w-6" /> {t?.gameplaySection?.representYourCountry || "Represent Your Country"}
            </h3>
            <p className="mb-3 text-gray-200">
              One of the unique features in Speed Stars is the ability to represent your country in competitions. Choose
              your nation and race to bring home glory. Whether you're challenging your friends or climbing the global
              leaderboard, the international pride adds a competitive edge.
            </p>
            <p className="text-gray-200">
              With its blend of chaotic action, hilarious animation, and competitive gameplay, Speed Stars is both
              addicting and entertaining. You'll find yourself returning time and again to beat your own time and
              experience the thrill of perfectly timed runs.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

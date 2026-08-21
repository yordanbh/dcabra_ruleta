import { useCallback, useEffect, useState } from "react";
import { Eye } from "lucide-react";
import Header from "./components/Header";
import ParticipantCounter from "./components/ParticipantCounter";
import ParticipantList from "./components/ParticipantList";
import ParticipantLoader from "./components/ParticipantLoader";
import RouletteStage from "./components/RouletteStage";
import SideBanner from "./components/SideBanner";
import WelcomeExperience from "./components/WelcomeExperience";
import WinnerPage from "./components/WinnerPage";
import raffleConfig from "./config/raffleConfig";
import useDraw from "./hooks/useDraw";
import { hasSeenWelcome, markWelcomeSeen } from "./utils/storage";
import { runViewTransition } from "./utils/viewTransition";
import WinnersModal from "./components/WinnersModal";

export default function App() {
  const [screen, setScreen] = useState("raffle");
  const [showWelcome, setShowWelcome] = useState(() => !hasSeenWelcome());
  const [showParticipants, setShowParticipants] = useState(false);
  const [showWinners, setShowWinners] = useState(false);

  const handleDrawComplete = useCallback(async () => {
    await runViewTransition(() => setScreen("winner"));
  }, []);

  const draw = useDraw({ onDrawComplete: handleDrawComplete });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [screen]);

  const completeWelcome = useCallback(() => {
    markWelcomeSeen();
    setShowWelcome(false);

    requestAnimationFrame(() => {
      window.scrollTo({
        top: 0,
        behavior: "auto",
      });
    });
  }, []);

  const skipWelcome = useCallback(() => {
    markWelcomeSeen();
    setShowWelcome(false);
    requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "smooth" }));
  }, []);

  const replayWelcome = useCallback(() => {
    runViewTransition(() => {
      setScreen("raffle");
      setShowWelcome(true);
    }).then(() => {
      requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "smooth" }));
    });
  }, []);

  const backToRaffle = useCallback(() => {
    runViewTransition(() => setScreen("raffle"));
  }, []);

  if (screen === "winner") {
    return (
      <WinnerPage
        winner={draw.currentWinner}
        onBack={backToRaffle}
      />
    );
  }

  return (
    <div
      className={`bg-dcabra-bg font-sans ${showWelcome
        ? "min-h-screen"
        : "h-dvh overflow-hidden"
        }`}
    >
      {showWelcome && <WelcomeExperience onComplete={completeWelcome} onSkip={skipWelcome} />}

      <div
        className={`flex items-start justify-center ${showWelcome
          ? "min-h-screen"
          : "h-dvh overflow-hidden"
          }`}
      >
        <SideBanner src={raffleConfig.leftBanner} alt="Banner izquierdo" side="left" />

        <main className="flex h-dvh w-full max-w-2xl flex-1 flex-col overflow-hidden px-4 py-2 md:px-6">
          <Header onReplayWelcome={replayWelcome} onReset={draw.resetDraw} />

          <section className="space-y-4">
            <ParticipantCounter
              count={draw.participants.length}
              winnersCount={draw.winners.length}
              onShowWinners={() => setShowWinners(true)}
            />

            <ParticipantLoader
              onLoadFile={draw.loadParticipantsFromFile}
              onLoadDemo={draw.loadDemoData}
              disabled={draw.isSpinning}
            />

            {!!draw.participants.length && (
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={() => setShowParticipants(true)}
                  className="inline-flex items-center bg-dcabra-primary gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold text-white transition-all duration-300 hover:bg-dcabra-primary/20 hover:text-dcabra-primary"
                >
                  <Eye size={16} /> Ver participantes
                </button>
              </div>
            )}
          </section>

          <RouletteStage
            participants={draw.visibleParticipants}
            isSpinning={draw.isSpinning}
            targetAngle={draw.targetAngle}
            canSpin={draw.canSpin}
            isFinished={draw.isFinished}
            onDraw={draw.selectWinner}
          />
        </main>

        <SideBanner src={raffleConfig.rightBanner} alt="Banner derecho" side="right" />
      </div>

      <ParticipantList
        participants={draw.participants}
        isOpen={showParticipants}
        onClose={() => setShowParticipants(false)}
      />

      <WinnersModal
        winners={draw.winners}
        isOpen={showWinners}
        onClose={() => setShowWinners(false)}
      />
    </div>
  );
}

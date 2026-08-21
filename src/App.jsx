import { useCallback, useEffect, useState } from "react";
import { Eye } from "lucide-react";
import Header from "./components/Header";
import ParticipantCounter from "./components/ParticipantCounter";
import ParticipantList from "./components/ParticipantList";
import ParticipantLoader from "./components/ParticipantLoader";
import PrizeCard from "./components/PrizeCard";
import RouletteStage from "./components/RouletteStage";
import SideBanner from "./components/SideBanner";
import WelcomeExperience from "./components/WelcomeExperience";
import WinnerPage from "./components/WinnerPage";
import WinnersList from "./components/WinnersList";
import raffleConfig from "./config/raffleConfig";
import useDraw from "./hooks/useDraw";
import { hasSeenWelcome, markWelcomeSeen } from "./utils/storage";
import { runViewTransition } from "./utils/viewTransition";

export default function App() {
  const [screen, setScreen] = useState("raffle");
  const [showWelcome, setShowWelcome] = useState(() => !hasSeenWelcome());
  const [showParticipants, setShowParticipants] = useState(false);

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

  const resetAndReturn = useCallback(() => {
    draw.resetDraw();
    runViewTransition(() => setScreen("raffle"));
  }, [draw.resetDraw]);

  if (screen === "winner") {
    return (
      <WinnerPage
        winner={draw.currentWinner}
        onBack={backToRaffle}
        onReset={resetAndReturn}
      />
    );
  }

  return (
    <div className="min-h-screen bg-dcabra-bg font-sans">
      {showWelcome && <WelcomeExperience onComplete={completeWelcome} onSkip={skipWelcome} />}

      {draw.toast && (
        <div
          role="status"
          className={`fixed left-1/2 top-4 z-[100] -translate-x-1/2 rounded-xl border px-5 py-3 text-sm font-medium shadow-lg animate-toast ${draw.toast.type === "error"
            ? "border-red-200 bg-red-50 text-red-700"
            : draw.toast.type === "success"
              ? "border-green-200 bg-green-50 text-green-700"
              : "border-dcabra-border bg-dcabra-primaryFaded text-dcabra-primary"
            }`}
        >
          {draw.toast.message}
        </div>
      )}

      <div className="flex min-h-screen items-start justify-center">
        <SideBanner src={raffleConfig.leftBanner} alt="Banner izquierdo" side="left" />

        <main className="w-full max-w-2xl flex-1 px-4 py-4 md:px-6">
          <Header onReplayWelcome={replayWelcome} onReset={draw.resetDraw} />

          <section className="mt-4 space-y-4">
            <ParticipantCounter count={draw.participants.length} winnersCount={draw.winners.length} />
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
                  className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-dcabra-primary transition hover:bg-dcabra-primary/5"
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
            totalParticipants={draw.participants.length}
            maxVisible={draw.maxVisible}
            canSpin={draw.canSpin}
            isFinished={draw.isFinished}
            onDraw={draw.selectWinner}
          />

          <section className={`mb-8 grid grid-cols-1 gap-4 ${draw.winners.length ? "md:grid-cols-2" : "mx-auto max-w-sm"}`}>
            <PrizeCard />
            <WinnersList winners={draw.winners} />
          </section>

        </main>

        <SideBanner src={raffleConfig.rightBanner} alt="Banner derecho" side="right" />
      </div>

      <ParticipantList
        participants={draw.participants}
        isOpen={showParticipants}
        onClose={() => setShowParticipants(false)}
      />
    </div>
  );
}

import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { secondsToMin } from "../utils/secondsToMin";

interface UseShareOptions {
  sended: { id: string; timer: number } | null;
  user: { userName: string } | null;
  correctCount: number;
  totalSolved: number;
  mode: string;
  baseUrl?: string;
  services?: string;
}

export const useShare = ({
  sended,
  user,
  correctCount,
  totalSolved,
  mode,
  baseUrl = "https://know-it-all.ru/mixed-tasks",
  services = "vkontakte,telegram,odnoklassniki,reddit,qzone,renren,sinaWeibo,surfingbird,tencentWeibo",
}: UseShareOptions) => {
  const [, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (user && sended) {
      setSearchParams({ share: sended.id });

      const title =
        mode === "EXAM"
          ? `Я решил(а) правильно ${correctCount} из ${totalSolved} за ${secondsToMin(
              sended.timer,
            )}!`
          : `Я решил(а) правильно ${correctCount} из ${totalSolved}!`;

      type YaApi = { share2: (containerId: string, config: unknown) => void };
      const ya = (window as unknown as { Ya?: YaApi }).Ya;
      ya?.share2("ya", {
        theme: {
          services,
          bare: false,
          limit: 3,
        },
        content: {
          url: `${baseUrl}?share=${sended.id}`,
          title,
        },
      });
    }
  }, [
    sended,
    setSearchParams,
    user,
    correctCount,
    totalSolved,
    mode,
    baseUrl,
    services,
  ]);
};

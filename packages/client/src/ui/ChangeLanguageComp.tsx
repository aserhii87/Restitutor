import { Select } from "@mantine/core";
import { SupportedLanguages } from "@project/shared/src/rpc/ServerMessageTypes";
import { TranslationUrl } from "../game/definitions/Constant";
import { GameOptionUpdated } from "../game/Events";
import { Languages } from "../game/Languages";
import { saveGame } from "../game/LoadSave";
import { openUrl } from "../rpc/SteamClient";
import { G, isLanguageChanged, setLanguage } from "../utils/Global";
import { refreshOnTypedEvent } from "../utils/Hook";
import { $t, L } from "../utils/i18n";

export function ChangeLanguageComp(): React.ReactNode {
   refreshOnTypedEvent(GameOptionUpdated);
   return (
      <>
         <Select
            className="f1"
            leftSection={<div className="mi sm">translate</div>}
            checkIconPosition="right"
            data={SupportedLanguages.map((language) => ({
               label: Languages[language].$$Language,
               value: language,
            }))}
            value={G.save.options.language}
            onChange={(value) => {
               if (value) {
                  setLanguage(value);
                  GameOptionUpdated.emit();
               }
            }}
         />
         {isLanguageChanged() && (
            <div className="box row p10 my10 text-sm yellow">
               <div className="f1 text-yellow">{$t(L.SomeInGameTextsRequireAGameReloadToDisplayInTheNewLanguage)}</div>
               <button
                  className="btn primary"
                  onClick={() => {
                     saveGame(G.save).then(() => window.location.reload());
                  }}
               >
                  {$t(L.Reload)}
               </button>
            </div>
         )}
         {G.save.options.language !== "en" && (
            <div className="row text-sm text-dimmed my5 pointer" onClick={() => openUrl(TranslationUrl)}>
               <div className="f1">{$t(L.HelpImproveThisTranslationOnGithub)}</div>
               <div className="mi sm pointer">open_in_new</div>
            </div>
         )}
      </>
   );
}

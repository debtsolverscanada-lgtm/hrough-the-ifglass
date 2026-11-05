"""Voicebox engine test: renders the reel lines + a horror sample with one engine."""
import json, sys, os, time, traceback
import numpy as np, soundfile as sf, torch
eng = sys.argv[1]; out = f"out/{eng}"; os.makedirs(out, exist_ok=True)
L = json.load(open("tools/voicebox_test/lines.json"))
torch.set_num_threads(os.cpu_count())
log = {}
def save(name, wav, sr):
    wav = np.asarray(wav, dtype=np.float32).squeeze()
    sf.write(f"{out}/{name}.wav", wav, sr); log[name] = round(len(wav)/sr, 2); print(name, log[name], flush=True)

if eng.startswith("chatterbox"):
    from huggingface_hub import snapshot_download
    from chatterbox.tts_turbo import ChatterboxTurboTTS
    _l = torch.load
    torch.load = lambda *a, **k: _l(*a, **{**k, "map_location": "cpu"})
    m = ChatterboxTurboTTS.from_pretrained(device="cpu")
    torch.load = _l
    ref = "tools/voicebox_test/ara_ref.wav"
    def gen(t): return m.generate(t, audio_prompt_path=ref, temperature=0.8, top_k=1000, top_p=0.95, repetition_penalty=1.2), m.sr
    reel = [l.replace("Bye bye, ElevenLabs.", "[chuckle] Bye bye, ElevenLabs.") for l in L["reel"]]
    horror = L["horror"].replace("a man danced toward me.", "a man danced toward me. [gasp]").replace("He was smiling", "[whisper] He was smiling")
elif eng.startswith("kokoro"):
    from kokoro import KPipeline
    p = KPipeline(lang_code="a"); voice = eng.split("-", 1)[1]
    def gen(t):
        return np.concatenate([r.audio.numpy() for r in p(t, voice=voice, speed=1.05) if r.audio is not None]), 24000
    reel, horror = L["reel"], L["horror"]
elif eng.startswith("qwen"):
    from qwen_tts import Qwen3TTSModel
    m = Qwen3TTSModel.from_pretrained("Qwen/Qwen3-TTS-12Hz-1.7B-VoiceDesign", torch_dtype=torch.float32, low_cpu_mem_usage=False)
    TECH = "Energetic young male tech creator in his twenties, friendly and upbeat, quick confident delivery, clear American accent."
    HOR = "Calm older man with a deep, low, slightly gravelly voice, speaking slowly and quietly like telling a ghost story at night."
    def gen(t, d=TECH):
        w, sr = m.generate_voice_design(text=t, instruct=d, language="English"); return w[0], sr
    reel, horror = L["reel"], L["horror"]
    _g = gen; gen_h = lambda t: _g(t, HOR)
for i, t in enumerate(reel):
    t0 = time.time()
    try: save(f"reel_{i:02d}", *gen(t)); print(" took", round(time.time()-t0,1), flush=True)
    except Exception: traceback.print_exc()
try: save("horror", *(gen_h(horror) if eng.startswith("qwen") else gen(horror)))
except Exception: traceback.print_exc()
json.dump(log, open(f"{out}/durations.json", "w"), indent=1)

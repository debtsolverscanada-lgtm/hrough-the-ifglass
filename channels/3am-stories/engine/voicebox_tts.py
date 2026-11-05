"""Free local narration with the voicebox engines (github.com/jamiepine/voicebox).
usage: echo "text" | python3 voicebox_tts.py <chatterbox|kokoro|qwen> <voice> out.wav
chatterbox = Chatterbox Turbo (expressive, understands [gasp] [sigh] [chuckle]); voice = optional reference wav path.
kokoro = Kokoro 82M preset voices (af_heart, am_michael ...). qwen = Qwen3-TTS VoiceDesign; voice = a written description."""
import sys, numpy as np, soundfile as sf, torch
eng, voice, out = sys.argv[1], sys.argv[2], sys.argv[3]
text = sys.stdin.read().strip()
torch.set_num_threads(torch.get_num_threads())
if eng == 'chatterbox':
    from chatterbox.tts_turbo import ChatterboxTurboTTS
    _l = torch.load; torch.load = lambda *a, **k: _l(*a, **{**k, 'map_location': 'cpu'})
    m = ChatterboxTurboTTS.from_pretrained(device='cpu'); torch.load = _l
    torch.manual_seed(7)
    parts = [p for p in text.split('\n\n') if p.strip()]  # one paragraph at a time keeps Turbo stable on long reads
    wavs = []
    for p in parts:
        w = m.generate(p, audio_prompt_path=voice or None, temperature=0.8, top_k=1000, top_p=0.95, repetition_penalty=1.2)
        wavs += [w.squeeze().cpu().numpy(), np.zeros(int(m.sr * 0.45), dtype=np.float32)]
    sf.write(out, np.concatenate(wavs), m.sr)
elif eng == 'kokoro':
    from kokoro import KPipeline
    p = KPipeline(lang_code='a')
    sf.write(out, np.concatenate([r.audio.numpy() for r in p(text, voice=voice or 'af_heart', speed=1.0) if r.audio is not None]), 24000)
elif eng == 'qwen':
    from qwen_tts import Qwen3TTSModel
    m = Qwen3TTSModel.from_pretrained('Qwen/Qwen3-TTS-12Hz-1.7B-VoiceDesign', torch_dtype=torch.float32, low_cpu_mem_usage=False)
    w, sr = m.generate_voice_design(text=text, instruct=voice, language='English'); sf.write(out, w[0], sr)
print('voicebox', eng, 'ok', flush=True)

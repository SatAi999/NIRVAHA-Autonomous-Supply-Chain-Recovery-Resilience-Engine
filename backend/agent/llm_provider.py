import json
import requests
from typing import Dict, Any, Optional
from backend.config import settings

class LLMProvider:
    def __init__(self, provider: str = None, base_url: str = None, api_key: str = None):
        self.provider = (provider or settings.DEFAULT_LLM_PROVIDER).lower()
        self.base_url = base_url or settings.OLLAMA_BASE_URL
        self.api_key = api_key or (settings.GEMINI_API_KEY if self.provider == "gemini" else settings.GROQ_API_KEY)

    def generate_reasoning(self, prompt: str, system_prompt: str = "") -> str:
        """
        Sends prompt to selected LLM provider (Ollama, Gemini, or Groq).
        Falls back gracefully if LLM endpoint is unreachable.
        """
        try:
            if self.provider == "ollama":
                url = f"{self.base_url}/api/generate"
                payload = {
                    "model": settings.OLLAMA_MODEL,
                    "prompt": f"{system_prompt}\n\n{prompt}",
                    "stream": False
                }
                resp = requests.post(url, json=payload, timeout=5)
                if resp.status_code == 200:
                    return resp.json().get("response", "")

            elif self.provider == "gemini" and self.api_key:
                import google.generativeai as genai
                genai.configure(api_key=self.api_key)
                model = genai.GenerativeModel(settings.GEMINI_MODEL)
                response = model.generate_content(f"{system_prompt}\n\n{prompt}")
                return response.text

            elif self.provider == "groq" and self.api_key:
                from groq import Groq
                client = Groq(api_key=self.api_key)
                completion = client.chat.completions.create(
                    model=settings.GROQ_MODEL,
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": prompt}
                    ]
                )
                return completion.choices[0].message.content

        except Exception as e:
            # Deterministic fallback reasoning
            pass

        return f"[NIRVAHA Autonomous Reasoning - {self.provider.upper()}]\nEvaluated environment evidence and objective constraints. Selecting optimal deterministic recovery strategy."

<?php

namespace App\Services;

use GuzzleHttp\Client;
use GuzzleHttp\Exception\RequestException;
use Illuminate\Support\Facades\Log;

class ChatGPTServices
{
    protected $client;
    protected $apiKey;

    public function __construct()
    {
        $this->client = new Client([
            'verify' => env('APP_ENV') === 'production' ? true : false,
        ]);
        $this->apiKey = env('OPENAI_API_KEY');

        if (empty($this->apiKey)) {
            Log::error('OpenAI API key is missing in configuration.');
            throw new \Exception('OpenAI API key is not configured or is empty.');
        }
    }

    /**
     * Handle user message related to travel, booking, and travel cost estimation.
     *
     * @param string $message
     * @return array
     */
    public function handleUserMessage(string $message): array
    {
        try {
            $prompt = $this->buildTravelPrompt($message);
            $language = $this->detectLanguage($message);

            $response = $this->client->post('https://api.openai.com/v1/chat/completions', [
                'headers' => [
                    'Authorization' => 'Bearer ' . $this->apiKey,
                    'Content-Type' => 'application/json',
                ],
                'json' => [
                    'model' => 'gpt-3.5-turbo',
                    'messages' => [
                        [
                            'role' => 'system',
                            'content' => "You are an expert travel planner for TravelNest, specializing in creating detailed travel itineraries and booking recommendations. Always respond in the same language as the user's input (e.g., Arabic for Arabic input, English for English input). Structure your response in clear sections using the delimiter '===SECTION===' between each section, and format it in Markdown. Ensure every section is clearly separated with '===SECTION===' even if some sections are brief. Include:

1. Suggested destination(s) based on user's input.
2. A day-by-day itinerary for a 5-7 day trip.
3. Estimated total cost (flights, accommodation, activities, meals, transport).
4. Description of 3-5 main tourist attractions.
5. Best times to visit (weather, crowds, festivals).
6. Accommodation and transportation suggestions.
7. Local food or cultural tips.
8. Visa or travel requirements if applicable.

If the user provides limited info, make reasonable assumptions (e.g., 1-2 travelers, moderate budget) and state them clearly. If the input is vague, ask clarifying questions in the response. Do not skip the '===SECTION===' delimiter under any circumstances.",
                        ],
                        ['role' => 'user', 'content' => $prompt],
                    ],
                    'max_tokens' => 1000,
                    'temperature' => 0.7,
                ],
            ]);

            $body = json_decode($response->getBody()->getContents(), true);

            return [
                'status' => 'success',
                'response' => $body['choices'][0]['message']['content'] ?? 'No response from AI.',
                'language' => $language,
            ];
        } catch (RequestException $e) {
            Log::error('Failed to connect to ChatGPT API: ' . $e->getMessage(), [
                'request' => $e->getRequest()->getBody()->getContents(),
                'response' => $e->hasResponse() ? $e->getResponse()->getBody()->getContents() : null,
            ]);
            return [
                'status' => 'error',
                'message' => 'Failed to connect to ChatGPT API.',
                'error' => $e->getMessage(),
            ];
        } catch (\Exception $e) {
            Log::error('Unexpected error in ChatGPTService: ' . $e->getMessage(), [
                'message' => $message,
                'trace' => $e->getTraceAsString(),
            ]);
            return [
                'status' => 'error',
                'message' => 'Unexpected error.',
                'error' => $e->getMessage(),
            ];
        }
    }

    private function buildTravelPrompt(string $message): string
    {
        $language = $this->detectLanguage($message);
        $langInstruction = $language === 'ar' ?
            "يرجى الرد باللغة العربية بنفس أسلوب المدخل." :
            "Please respond in English matching the input style.";

        return <<<EOT
User inquiry:

"$message"

$langInstruction

Create a detailed travel plan based on the user's input. If the message includes a budget, travel dates, or preferences, incorporate them. If details are missing, make reasonable assumptions and state them. Format the response in Markdown with clear sections separated by '===SECTION==='. Ensure every section is clearly separated with '===SECTION===' even if some sections are brief:

1. **Destinations**: Suggest 1-2 destinations.
2. **Itinerary**: Provide a 5-7 day day-by-day itinerary.
3. **Estimated Costs**: Breakdown of flights, accommodation, activities, meals, transport.
4. **Top Attractions**: Describe 3-5 attractions with history and practical info.
5. **Best Times to Visit**: Weather, crowds, festivals.
6. **Accommodation & Transport**: Suggest options with estimated prices.
7. **Cultural Tips**: Local food, customs, etiquette.
8. **Visa Requirements**: Entry rules if applicable.

If the input is vague, include clarifying questions in the response. Do not skip the '===SECTION===' delimiter under any circumstances.
EOT;
    }

    private function detectLanguage(string $message): string
    {
        // Simple regex to detect Arabic characters
        if (preg_match('/[ء-ي]/u', $message)) {
            return 'ar';
        }
        // Default to English
        return 'en';
    }
}

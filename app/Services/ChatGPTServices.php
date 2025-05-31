<?php

namespace App\Services;

use GuzzleHttp\Client;
use GuzzleHttp\Exception\RequestException;
use Illuminate\Support\Facades\DB;

class TravelChatGPTService
{
    protected $client;
    protected $apiKey;

    public function __construct()
    {
        $this->client = new Client();
        $this->apiKey = env('OPENAI_API_KEY');
    }

    /**
     * Retrieve trip details from the database
     *
     * @param int $tripId
     * @return array|string
     */
    public function getTripDetails($tripId)
    {
        $trip = DB::table('trips')->where('id', $tripId)->first();

        if ($trip) {
            return [
                'id' => $trip->id,
                'title' => $trip->title,
                'destination' => $trip->destination,
                'description' => $trip->description,
                'start_date' => $trip->start_date,
                'end_date' => $trip->end_date,
                'price' => $trip->price,
                'image_url' => $trip->image_url,
                'booking_link' => $trip->booking_link,
                'exists' => true
            ];
        }

        return ['exists' => false];
    }

    /**
     * Find similar trips based on destination or other criteria
     *
     * @param string $destination
     * @param int $excludeTripId
     * @return array
     */
    public function findSimilarTrips($destination, $excludeTripId)
    {
        return DB::table('trips')
            ->where('destination', $destination)
            ->where('id', '!=', $excludeTripId)
            ->limit(3)
            ->get()
            ->map(function ($trip) {
                return [
                    'id' => $trip->id,
                    'title' => $trip->title,
                    'destination' => $trip->destination,
                    'price' => $trip->price
                ];
            })
            ->toArray();
    }

    /**
     * Search for a trip and provide a comprehensive response
     *
     * @param int $tripId
     * @return array
     */
    public function searchTrip($tripId)
    {
        $tripDetails = $this->getTripDetails($tripId);

        if ($tripDetails['exists']) {
            $response = [
                'status' => 'found',
                'message' => 'Trip is available on our site!',
                'trip' => $tripDetails
            ];

            $similarTrips = $this->findSimilarTrips(
                $tripDetails['destination'],
                $tripDetails['id']
            );

            $response['similar_trips'] = $similarTrips;

            return $response;
        }

        try {
            $aiSuggestion = $this->askChatGPT(
                "Suggest a travel trip similar to the trip with ID $tripId. " .
                    "Include a brief description and explain why it is worth recommending."
            );

            return [
                'status' => 'not_found',
                'message' => 'Unfortunately, this trip is not in our database.',
                'ai_suggestion' => $aiSuggestion['choices'][0]['message']['content']
            ];
        } catch (\Exception $e) {
            return [
                'status' => 'error',
                'message' => 'An error occurred while searching for the trip.',
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * Ask ChatGPT for a trip-related query
     *
     * @param string $message
     * @return array
     */
    public function askChatGPT($message)
    {
        try {
            $response = $this->client->post('https://api.openai.com/v1/chat/completions', [
                'headers' => [
                    'Authorization' => 'Bearer ' . $this->apiKey,
                    'Content-Type' => 'application/json',
                ],
                'json' => [
                    'model' => 'gpt-4',
                    'messages' => [
                        ['role' => 'system', 'content' => 'You are a travel recommendation assistant.'],
                        ['role' => 'user', 'content' => $message],
                    ],
                    'max_tokens' => 200,
                    'temperature' => 0.7,
                ],
            ]);

            $responseBody = json_decode($response->getBody()->getContents(), true);

            if (isset($responseBody['choices'][0]['message']['content'])) {
                return $responseBody;
            }

            return ['choices' => [['message' => ['content' => 'No meaningful response from ChatGPT.']]]];
        } catch (RequestException $e) {
            throw new \Exception('Error connecting to OpenAI API: ' . $e->getMessage());
        }
    }
}

import os
import time
import logging
import requests
from datadog import initialize, statsd

logging.basicConfig(
    format="%(asctime)s [%(levelname)s] %(message)s",
    level=logging.INFO,
)
logger = logging.getLogger(__name__)

# Initialize Datadog with your API and APP keys set as environment variables
options = {
    'api_key': os.environ.get('u need input api key'),
    'app_key': os.environ.get('u need input app key'),

}
initialize(**options)


def fetch_pet():
    while True:
        try:
            logger.info("Fetching Pet from API...")
            statsd.increment("Pet.request.count.available", tags=["action:attempt"])

            response = requests.get("https://petstore.swagger.io/v2/pet/findByStatus?status=available", timeout=5)
            response.raise_for_status()
            data = response.json()
            if isinstance(data, list) and data:
                pet = data[0]  # get the first pet from the list
                logger.info(f"Fetched Pet: {pet.get('name', 'Unnamed')}")
            else:
                logger.warning("No pet found in API response.")

            statsd.increment("Pet.request.count", tags=["action:success"])
        except Exception as e:
            logger.error(f"Failed to fetch Pet : {str(e)}")
            try:
                statsd.increment("Pet.request.count", tags=["action:failed"])
            except Exception as se:
                logger.error(f"Statsd is fail {se}")

        #time.sleep()  # Sleep for 5 seconds

if __name__ == "__main__":
    fetch_pet()

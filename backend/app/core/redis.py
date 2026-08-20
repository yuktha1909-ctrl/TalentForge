import json
import logging
from typing import Optional, Any
from app.core.config import settings

logger = logging.getLogger(__name__)

class CacheClient:
    """Redis cache wrapper with graceful in-memory fallback."""

    def __init__(self):
        self._redis = None
        self._memory_store = {}
        self._connected = False
        self._init_redis()

    def _init_redis(self):
        try:
            import redis
            self._redis = redis.Redis.from_url(
                settings.REDIS_URL,
                decode_responses=True,
                socket_timeout=2
            )
            # Ping to test connection
            self._redis.ping()
            self._connected = True
            logger.info("Connected to Redis successfully.")
        except Exception as e:
            logger.warning(f"Redis unavailable ({e}). Falling back to in-memory cache.")
            self._connected = False

    def get(self, key: str) -> Optional[Any]:
        if self._connected and self._redis:
            try:
                val = self._redis.get(key)
                return json.loads(val) if val else None
            except Exception as e:
                logger.error(f"Error reading from Redis: {e}")
        
        val = self._memory_store.get(key)
        return json.loads(val) if val else None

    def set(self, key: str, value: Any, expire_seconds: int = 3600):
        serialized = json.dumps(value)
        if self._connected and self._redis:
            try:
                self._redis.setex(key, expire_seconds, serialized)
                return
            except Exception as e:
                logger.error(f"Error writing to Redis: {e}")

        self._memory_store[key] = serialized

    def delete(self, key: str):
        if self._connected and self._redis:
            try:
                self._redis.delete(key)
            except Exception:
                pass
        self._memory_store.pop(key, None)


cache_client = CacheClient()

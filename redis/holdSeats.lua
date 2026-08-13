-- KEYS = list of seat hold keys (hold:{showtimeId}:{seatId})
-- ARGV[1] = holder ID (userId)
-- ARGV[2] = TTL in seconds

local holder = ARGV[1]
local ttl = tonumber(ARGV[2])

for i = 1, #KEYS do
    if redis.call('EXISTS', KEYS[i]) == 1 then
        return 0
    end
end

for i = 1, #KEYS do
    redis.call('SET', KEYS[i], holder, 'EX', ttl)
end

return 1
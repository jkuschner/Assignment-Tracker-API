// fetch public holidays from Nager.Date Public Holiday API
// GET /api/calendar/holidays
export const getHolidays = async (req, res) => {
    try {
        const year = req.query.year || new Date().getFullYear();
        const countryCode = req.query.country || 'US';

        const response = await fetch(
            `https://date.nager.at/api/v3/PublicHolidays/${year}/${countryCode}`
        );

        if (!response.ok) {
            throw new Error(`Public Holiday API responded with staus ${response.status}`);
        }

        const holidays = await response.json();

        const today = new Date().toISOString().split('T')[0];
        const upcomingHolidays = holidays.filter((h) => h.date >= today);

        res.status(200).json({
            success: true,
            source: 'Nager.Date Public API',
            count: upcomingHolidays.length,
            data: upcomingHolidays.slice(0, 5), // next 5 holidays only
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch public calendar data',
            error: error.message,
        });
    }
};

// Check if a particular date is on a holiday
// GET /api/calendar/check-date
export const checkDateForHoliday = async (req, res) => {
    try {
        const { date } = req.query;
        
        if (!date) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a date in YYYY-MM-DD format',
            });
        }

        const year = date.split('-')[0];
        const response = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${year}/US`);

        const holidays = await response.json();
        const holidayMatch = holidays.find((h) => h.date === date);

        if (holidayMatch) {
            return res.status(200).json({
                isHoliday: true,
                message: `Warning: This date falls on an official holiday (${holidayMatch.name})!`,
                holiday: holidayMatch,
            });
        }

        res.status(200).json({
            isHoliday: false,
            message: 'No holiday conflicts for this date.',
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
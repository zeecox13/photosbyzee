// Booking Flow Management
let selectedService = null;
let selectedPrice = 0;
let selectedDate = null;
let selectedTime = null;
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

// Service Selection
function selectService(service, price) {
    selectedService = service;
    selectedPrice = price;
    
    // Update UI
    document.querySelectorAll('.service-option').forEach(opt => {
        opt.classList.remove('selected');
    });
    document.querySelector(`[data-service="${service}"]`).classList.add('selected');
    
    // Show continue button
    document.getElementById('step1Next').style.display = 'block';
}

// Step Navigation
function nextStep(step) {
    // Hide all steps
    document.querySelectorAll('.booking-step').forEach(s => {
        s.classList.remove('active');
    });
    
    // Show target step
    document.getElementById(`step${step}`).classList.add('active');
    
    // Special handling for step 2 (calendar)
    if (step === 2) {
        loadAvailabilityCalendar();
    }
    
    // Special handling for step 4 (summary)
    if (step === 4) {
        updateBookingSummary();
    }
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Calendar Functions
function loadAvailabilityCalendar() {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];
    
    document.getElementById('calendarMonth').textContent = 
        `${monthNames[currentMonth]} ${currentYear}`;
    
    // Fetch available dates from API
    fetchAvailableDates(currentYear, currentMonth + 1)
        .then(dates => {
            renderCalendar(dates);
        })
        .catch(error => {
            console.error('Error loading availability:', error);
            // Fallback: show demo dates
            renderCalendar(getDemoAvailableDates());
        });
}

function fetchAvailableDates(year, month) {
    // In production, this would call your API
    return fetch(`/api/availability?year=${year}&month=${month}`)
        .then(res => res.json())
        .then(data => data.availableDates)
        .catch(() => getDemoAvailableDates());
}

function getDemoAvailableDates() {
    // Demo: return some available dates for the current month
    const today = new Date();
    const dates = [];
    for (let i = 1; i <= 28; i++) {
        const date = new Date(currentYear, currentMonth, i);
        if (date >= today && date.getDay() !== 0 && date.getDay() !== 6) {
            dates.push(i);
        }
    }
    return dates;
}

function renderCalendar(availableDates) {
    const grid = document.getElementById('availabilityCalendar');
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    let html = '';
    
    // Day headers
    dayNames.forEach(day => {
        html += `<div class="calendar-day-header">${day}</div>`;
    });
    
    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
        html += '<div class="calendar-day"></div>';
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(currentYear, currentMonth, day);
        const isPast = date < new Date().setHours(0, 0, 0, 0);
        const isAvailable = availableDates.includes(day) && !isPast;
        
        let classes = 'calendar-day';
        if (isPast) {
            classes += ' unavailable';
        } else if (isAvailable) {
            classes += ' available';
        } else {
            classes += ' unavailable';
        }
        
        html += `<div class="${classes}" onclick="selectDate(${day})">${day}</div>`;
    }
    
    grid.innerHTML = html;
}

function selectDate(day) {
    selectedDate = new Date(currentYear, currentMonth, day);
    
    // Update UI
    document.querySelectorAll('.calendar-day').forEach(dayEl => {
        dayEl.classList.remove('selected');
    });
    event.target.classList.add('selected');
    
    // Load time slots
    loadTimeSlots(day);
}

function loadTimeSlots(day) {
    // Fetch available times for selected date
    fetch(`/api/availability/times?date=${currentYear}-${currentMonth + 1}-${day}`)
        .then(res => res.json())
        .then(data => {
            displayTimeSlots(data.times);
        })
        .catch(() => {
            // Demo times
            displayTimeSlots(['9:00 AM', '11:00 AM', '2:00 PM', '4:00 PM']);
        });
}

function displayTimeSlots(times) {
    const container = document.getElementById('timeGrid');
    const slotsDiv = document.getElementById('timeSlots');
    
    slotsDiv.style.display = 'block';
    
    container.innerHTML = times.map(time => 
        `<div class="time-slot" onclick="selectTime('${time}')">${time}</div>`
    ).join('');
}

function selectTime(time) {
    selectedTime = time;
    
    // Update UI
    document.querySelectorAll('.time-slot').forEach(slot => {
        slot.classList.remove('selected');
    });
    event.target.classList.add('selected');
    
    // Show continue button
    document.getElementById('step2Next').style.display = 'block';
}

function previousMonth() {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    loadAvailabilityCalendar();
}

function nextMonth() {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    loadAvailabilityCalendar();
}

// Update Booking Summary
function updateBookingSummary() {
    const serviceNames = {
        'family': 'Family Session',
        'couples': 'Couples & Engagement',
        'newborn': 'Newborn & Maternity',
        'senior': 'Senior Portraits',
        'headshot': 'Headshots & Branding',
        'event': 'Events & Weddings'
    };
    
    const deposit = selectedPrice * 0.5;
    
    document.getElementById('summaryService').textContent = serviceNames[selectedService] || selectedService;
    document.getElementById('summaryDate').textContent = selectedDate ? selectedDate.toLocaleDateString() : '-';
    document.getElementById('summaryTime').textContent = selectedTime || '-';
    document.getElementById('summaryTotal').textContent = `$${selectedPrice}`;
    document.getElementById('summaryDeposit').textContent = `$${deposit.toFixed(2)}`;
}

// Process Booking
async function processBooking() {
    const formData = {
        service: selectedService,
        price: selectedPrice,
        date: selectedDate.toISOString(),
        time: selectedTime,
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        location: document.getElementById('location').value,
        notes: document.getElementById('notes').value
    };
    
    try {
        // Create booking and Stripe checkout session
        const response = await fetch('/api/bookings/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        
        if (data.success) {
            // Redirect to Stripe Checkout
            const stripe = Stripe(data.stripePublishableKey);
            stripe.redirectToCheckout({ sessionId: data.sessionId });
        } else {
            alert('Error creating booking: ' + data.message);
        }
    } catch (error) {
        console.error('Booking error:', error);
        alert('An error occurred. Please try again.');
    }
}

// Initialize calendar on load
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('availabilityCalendar')) {
        loadAvailabilityCalendar();
    }
});


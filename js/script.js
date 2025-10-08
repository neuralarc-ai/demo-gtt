// Bright Risk Analysis Dashboard JavaScript

// Portfolio data based on agent conversation analysis
const portfolioData = {
    accountName: "FRUIT AND VEG INTERNATIONAL",
    sai: "AF345HU89",
    effectiveDate: "06/29/2023",
    totalProperties: 32, // Actual count from Excel
    statesCovered: 27, // Matches agent conversation "25+ states"
    criticalProperties: 15, // Pre-1950 properties from agent conversation
    ageSpan: 107, // 1917-2024
    oldestYear: 1917,
    newestYear: 2024,
    overallRiskScore: 9.2 // From agent conversation
};

// Construction type data
const constructionData = {
    labels: ['Light Non-Combustible', 'Joisted Masonry', 'Frame', 'Masonry Non-Combustible'],
    datasets: [{
        label: 'Properties by Construction Type',
        data: [18, 5, 4, 5],
        backgroundColor: [
            '#3b82f6', // Light Non-Combustible - Blue
            '#ef4444', // Joisted Masonry - Red (Higher risk)
            '#f59e0b', // Frame - Orange
            '#10b981'  // Masonry Non-Combustible - Green
        ],
        borderColor: [
            '#1d4ed8',
            '#dc2626',
            '#d97706',
            '#059669'
        ],
        borderWidth: 2
    }]
};

// Portfolio distribution data by risk level (based on agent conversation)
const portfolioDistributionData = {
    all: {
        labels: ['Ohio', 'Oklahoma', 'Alaska', 'California', 'Washington', 'DC', 'Other States'],
        data: [1, 1, 1, 1, 1, 1, 26], // All 32 properties
        backgroundColor: [
            '#3b82f6', // Ohio - Blue (Medium risk 6.2/10)
            '#ef4444', // Oklahoma - Red (Critical 9.1/10)
            '#10b981', // Alaska - Green (High risk 7.8/10)
            '#f59e0b', // California - Orange (High risk 8.2/10)
            '#8b5cf6', // Washington - Purple (Critical 9.8/10)
            '#06b6d4', // DC - Cyan (Critical 9.3/10)
            '#6b7280'  // Other - Gray (Mixed risk levels)
        ]
    },
    critical: {
        labels: ['Oklahoma', 'Washington', 'DC', 'Other Critical'],
        data: [1, 1, 1, 12], // 15 total critical properties
        backgroundColor: ['#ef4444', '#8b5cf6', '#06b6d4', '#dc2626']
    },
    high: {
        labels: ['Alaska', 'California', 'Other High Risk'],
        data: [1, 1, 8], // 10 total high risk properties
        backgroundColor: ['#10b981', '#f59e0b', '#ea580c']
    },
    medium: {
        labels: ['Ohio', 'Other Medium Risk'],
        data: [1, 4], // 5 total medium risk properties
        backgroundColor: ['#3b82f6', '#d97706']
    },
    low: {
        labels: ['Low Risk Properties'],
        data: [2], // 2 total low risk properties
        backgroundColor: ['#16a34a']
    }
};

// Risk trend data (simulated)
const riskTrendData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [{
        label: 'Risk Score Trend',
        data: [7.2, 7.5, 7.8, 8.1, 8.4, 8.7, 8.9, 9.0, 9.1, 9.2, 9.2, 9.2],
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4
    }]
};

// Global chart variables for dynamic updates
let portfolioChart = null;
let constructionChart = null;
let riskTrendChart = null;

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
    setupEventListeners();
    initializeCharts();
    updateLastUpdated();
    animateRiskScore();
    startRealTimeUpdates();
});

function initializeDashboard() {
    console.log('🎯 Bright Risk Analysis Dashboard Initialized');
    
    // Add loading animation
    document.body.classList.add('loading');
    
    // Simulate loading time
    setTimeout(() => {
        document.body.classList.remove('loading');
        document.body.classList.add('fade-in');
    }, 1000);
}

function setupEventListeners() {
    // Export report button
    const exportButton = document.querySelector('.btn-primary');
    if (exportButton) {
        exportButton.addEventListener('click', exportReport);
    }
    
    // Risk score animation trigger
    const riskScoreDisplay = document.querySelector('.risk-score-display');
    if (riskScoreDisplay) {
        riskScoreDisplay.addEventListener('click', animateRiskScore);
    }
    
    // Portfolio filter dropdown
    const portfolioFilter = document.querySelector('.analysis-filter');
    if (portfolioFilter) {
        portfolioFilter.addEventListener('change', function(e) {
            updatePortfolioChart(e.target.value);
        });
    }
}

function initializeCharts() {
    // Construction Chart
    const constructionCtx = document.getElementById('constructionChart');
    if (constructionCtx) {
        constructionChart = new Chart(constructionCtx, {
            type: 'doughnut',
            data: constructionData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: '#374151',
                            font: {
                                family: 'Inter, sans-serif',
                                size: 12
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        titleColor: '#111827',
                        bodyColor: '#111827',
                        borderColor: '#e5e7eb',
                        borderWidth: 1
                    }
                },
                cutout: '60%'
            }
        });
    }
    
    // Portfolio Distribution Chart
    const portfolioCtx = document.getElementById('portfolioChart');
    if (portfolioCtx) {
        portfolioChart = new Chart(portfolioCtx, {
            type: 'bar',
            data: {
                labels: portfolioDistributionData.all.labels,
                datasets: [{
                    label: 'Properties by State',
                    data: portfolioDistributionData.all.data,
                    backgroundColor: portfolioDistributionData.all.backgroundColor,
                    borderColor: portfolioDistributionData.all.backgroundColor.map(color => color.replace('0.8', '1')),
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        titleColor: '#111827',
                        bodyColor: '#111827',
                        borderColor: '#e5e7eb',
                        borderWidth: 1
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: '#f3f4f6'
                        },
                        ticks: {
                            color: '#6b7280'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: '#6b7280'
                        }
                    }
                }
            }
        });
    }
    
    // Risk Trend Chart
    const riskTrendCtx = document.getElementById('riskTrendChart');
    if (riskTrendCtx) {
        riskTrendChart = new Chart(riskTrendCtx, {
            type: 'line',
            data: riskTrendData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        titleColor: '#111827',
                        bodyColor: '#111827',
                        borderColor: '#e5e7eb',
                        borderWidth: 1
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        min: 6,
                        max: 10,
                        grid: {
                            color: '#f3f4f6'
                        },
                        ticks: {
                            color: '#6b7280'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: '#6b7280'
                        }
                    }
                }
            }
        });
    }
}

// Function to update portfolio chart based on filter selection
function updatePortfolioChart(filterValue) {
    if (!portfolioChart) return;
    
    let selectedData;
    let chartTitle = 'Properties by State';
    
    switch(filterValue) {
        case 'critical':
            selectedData = portfolioDistributionData.critical;
            chartTitle = 'Critical Risk Properties (9.0+ Risk Score)';
            break;
        case 'high':
            selectedData = portfolioDistributionData.high;
            chartTitle = 'High Risk Properties (7.0-8.9 Risk Score)';
            break;
        case 'medium':
            selectedData = portfolioDistributionData.medium;
            chartTitle = 'Medium Risk Properties (5.0-6.9 Risk Score)';
            break;
        case 'low':
            selectedData = portfolioDistributionData.low;
            chartTitle = 'Low Risk Properties (Below 5.0 Risk Score)';
            break;
        default:
            selectedData = portfolioDistributionData.all;
            chartTitle = 'All Properties';
    }
    
    // Update chart data
    portfolioChart.data.labels = selectedData.labels;
    portfolioChart.data.datasets[0].data = selectedData.data;
    portfolioChart.data.datasets[0].backgroundColor = selectedData.backgroundColor;
    portfolioChart.data.datasets[0].borderColor = selectedData.backgroundColor.map(color => color.replace('0.8', '1'));
    
    // Update chart title
    portfolioChart.options.plugins.title = {
        display: true,
        text: chartTitle,
        font: {
            size: 16,
            weight: 'bold'
        },
        color: '#111827'
    };
    
    // Animate the update
    portfolioChart.update('active');
    
    console.log(`📊 Chart updated to show: ${chartTitle}`);
}

function animateRiskScore() {
    const riskScoreValue = document.querySelector('.risk-score-value');
    if (!riskScoreValue) return;
    
    let currentScore = 0;
    const targetScore = 9.2;
    const increment = targetScore / 50;
    
    const timer = setInterval(() => {
        currentScore += increment;
        if (currentScore >= targetScore) {
            currentScore = targetScore;
            clearInterval(timer);
        }
        riskScoreValue.textContent = currentScore.toFixed(1);
    }, 50);
}

function exportReport() {
    const reportData = {
        accountName: portfolioData.accountName,
        sai: portfolioData.sai,
        effectiveDate: portfolioData.effectiveDate,
        totalProperties: portfolioData.totalProperties,
        statesCovered: portfolioData.statesCovered,
        criticalProperties: portfolioData.criticalProperties,
        ageSpan: portfolioData.ageSpan,
        riskScore: 9.2,
        riskLevel: 'CRITICAL',
        generatedAt: new Date().toISOString()
    };
    
    const reportText = `
RISK ANALYSIS REPORT
====================

Account: ${reportData.accountName}
SAI: ${reportData.sai}
Effective Date: ${reportData.effectiveDate}

PORTFOLIO SUMMARY:
- Total Properties: ${reportData.totalProperties}
- States Covered: ${reportData.statesCovered}
- Critical Properties: ${reportData.criticalProperties}
- Age Span: ${reportData.ageSpan} years (${reportData.oldestYear}-${reportData.newestYear})

RISK ASSESSMENT:
- Overall Risk Score: ${reportData.riskScore}/10
- Risk Level: ${reportData.riskLevel}

CRITICAL RECOMMENDATIONS:
1. Structural engineering reports for all 15+ pre-1950 properties
2. Updated valuations for all 32 properties
3. Seismic risk assessments for Alaska and California
4. Operational continuity documentation across 27 states

Report Generated: ${new Date(reportData.generatedAt).toLocaleString()}
    `;
    
    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `risk-analysis-report-${reportData.sai}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function updateLastUpdated() {
    const now = new Date();
    const timeString = now.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    
    const lastUpdatedElement = document.getElementById('lastUpdated');
    if (lastUpdatedElement) {
        lastUpdatedElement.textContent = timeString;
    }
}

function startRealTimeUpdates() {
    // Update last updated time every minute
    setInterval(updateLastUpdated, 60000);
    
    // Simulate real-time risk score fluctuations
    setInterval(() => {
        const riskScoreDisplay = document.querySelector('.risk-score-display');
        if (riskScoreDisplay) {
            riskScoreDisplay.style.transform = 'scale(1.02)';
            setTimeout(() => {
                riskScoreDisplay.style.transform = 'scale(1)';
            }, 200);
        }
    }, 30000);
}

// Age distribution animation
function animateAgeDistribution() {
    const ageBars = document.querySelectorAll('.age-fill');
    ageBars.forEach((bar, index) => {
        setTimeout(() => {
            bar.style.width = bar.style.width || '0%';
        }, index * 200);
    });
}

// Initialize age distribution animation
setTimeout(animateAgeDistribution, 1500);

// Risk matrix hover effects
document.addEventListener('DOMContentLoaded', function() {
    const matrixCells = document.querySelectorAll('.matrix-cell');
    matrixCells.forEach(cell => {
        cell.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
            this.style.transition = 'transform 0.3s ease';
        });
        
        cell.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
});

// Critical property cards animation
function animateCriticalProperties() {
    const criticalCards = document.querySelectorAll('.critical-property-card');
    criticalCards.forEach((card, index) => {
        setTimeout(() => {
            card.classList.add('fade-in');
        }, index * 300);
    });
}

// Initialize critical properties animation
setTimeout(animateCriticalProperties, 2000);

// Recommendation cards animation
function animateRecommendations() {
    const recommendationCards = document.querySelectorAll('.recommendation-card');
    recommendationCards.forEach((card, index) => {
        setTimeout(() => {
            card.classList.add('fade-in');
        }, index * 200);
    });
}

// Initialize recommendations animation
setTimeout(animateRecommendations, 2500);

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // 'E' to export report
    if (e.key === 'e' && !e.target.matches('input, textarea')) {
        e.preventDefault();
        exportReport();
    }
    
    // 'R' to refresh risk score
    if (e.key === 'r' && !e.target.matches('input, textarea')) {
        e.preventDefault();
        animateRiskScore();
    }
});

// Error handling
window.addEventListener('error', function(e) {
    console.error('Dashboard Error:', e.error);
});

// Performance monitoring
if ('performance' in window) {
    window.addEventListener('load', function() {
        setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log('Dashboard Load Time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
        }, 0);
    });
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
        }
    });
}, observerOptions);

// Observe all cards for animation
document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.overview-card, .indicator-card, .critical-property-card, .recommendation-card');
    cards.forEach(card => {
        observer.observe(card);
    });
});

// Risk level color coding
function updateRiskLevelColors() {
    const riskElements = document.querySelectorAll('[class*="risk-"]');
    riskElements.forEach(element => {
        if (element.classList.contains('critical')) {
            element.style.setProperty('--risk-color', 'var(--risk-critical)');
        } else if (element.classList.contains('high')) {
            element.style.setProperty('--risk-color', 'var(--risk-high)');
        } else if (element.classList.contains('medium')) {
            element.style.setProperty('--risk-color', 'var(--risk-medium)');
        } else if (element.classList.contains('low')) {
            element.style.setProperty('--risk-color', 'var(--risk-low)');
        }
    });
}

// Initialize risk level colors
setTimeout(updateRiskLevelColors, 1000);

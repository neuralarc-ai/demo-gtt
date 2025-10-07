// Insurance Dashboard JavaScript - Interactive Features

// Sample data from the provided JSON
const dashboardData = {
    "batch": [
        {
            "totalFiles": "2",
            "packageName": "Submission Email",
            "packageID": "426",
            "packageStatus": "Verified",
            "fileNameList": [
                {
                    "fileName": "426_Summary.tif",
                    "imagepath": "\\\\Chninsuweb01\\cmrplus\\Prediction\\6_1009_Underwriting\\Summary\\250203040235086_3348\\Display\\426_Summary.tif",
                    "fieldList": [
                        {
                            "fieldname": "Occupancy Group",
                            "extracteddata": "Office, Warehouse",
                            "confidencescore": "100.00",
                            "confidenceflag": "AMBER",
                            "roi": "",
                            "rowid": "1",
                            "columnname": "Occupancy Group"
                        },
                        {
                            "fieldname": "SOV include any Restricted Country",
                            "extracteddata": "N",
                            "confidencescore": "100.00",
                            "confidenceflag": "GREY",
                            "roi": "0,0,0,0",
                            "rowid": "1",
                            "columnname": "SOV include any Restricted Country"
                        },
                        {
                            "fieldname": "Insured Name",
                            "extracteddata": "FRUIT AND VEG INTERNATIONAL",
                            "confidencescore": "100.00",
                            "confidenceflag": "GREY",
                            "roi": "249,1179,405,40",
                            "rowid": "1",
                            "columnname": "Insured Name"
                        },
                        {
                            "fieldname": "Broker Name",
                            "extracteddata": "Ryan Scrouge",
                            "confidencescore": "100.00",
                            "confidenceflag": "GREY",
                            "roi": "330,509,582,40",
                            "rowid": "1",
                            "columnname": "Broker Name"
                        },
                        {
                            "fieldname": "Broker Contact Person Email",
                            "extracteddata": "ryan.Scrouge@brokerage.com",
                            "confidencescore": "100.00",
                            "confidenceflag": "GREY",
                            "roi": "330,509,582,40",
                            "rowid": "1",
                            "columnname": "Broker Contact Person Email"
                        },
                        {
                            "fieldname": "Date Submission received from Broker",
                            "extracteddata": "09/25/2024",
                            "confidencescore": "100.00",
                            "confidenceflag": "GREY",
                            "roi": "478,555,251,30",
                            "rowid": "1",
                            "columnname": "Date Submission received from Broker"
                        },
                        {
                            "fieldname": "Date Submission received by Operations",
                            "extracteddata": "10/16/2024",
                            "confidencescore": "100.00",
                            "confidenceflag": "GREY",
                            "roi": "335,346,151,43",
                            "rowid": "1",
                            "columnname": "Date Submission received by Operations"
                        },
                        {
                            "fieldname": "Credited Underwriter",
                            "extracteddata": "William Alphabet",
                            "confidencescore": "100.00",
                            "confidenceflag": "GREY",
                            "roi": "346,233,832,43",
                            "rowid": "1",
                            "columnname": "Credited Underwriter"
                        },
                        {
                            "fieldname": "Effective Date",
                            "extracteddata": "10/04/2024",
                            "confidencescore": "0.00",
                            "confidenceflag": "AMBER",
                            "roi": "0,0,0,0",
                            "rowid": "1",
                            "columnname": "Effective Date"
                        },
                        {
                            "fieldname": "Expiration Date",
                            "extracteddata": "10/04/2025",
                            "confidencescore": "0.00",
                            "confidenceflag": "AMBER",
                            "roi": "0,0,0,0",
                            "rowid": "1",
                            "columnname": "Expiration Date"
                        },
                        {
                            "fieldname": "TIV Country",
                            "extracteddata": "UNITED STATES",
                            "confidencescore": "100.00",
                            "confidenceflag": "GREY",
                            "roi": "0,6,6,0",
                            "rowid": "1",
                            "columnname": "TIV Country"
                        },
                        {
                            "fieldname": "Insured Mailing Address",
                            "extracteddata": "654 Long Avenue City A, NY 12345",
                            "confidencescore": "100.00",
                            "confidenceflag": "GREY",
                            "roi": "249,1225,213,107",
                            "rowid": "1",
                            "columnname": "Insured Mailing Address"
                        },
                        {
                            "fieldname": "TIV Amount",
                            "extracteddata": "$223,394,489",
                            "confidencescore": "100.00",
                            "confidenceflag": "GREY",
                            "roi": "249,1525,695,25",
                            "rowid": "1",
                            "columnname": "TIV Amount"
                        }
                    ]
                }
            ]
        }
    ]
};

// Global variables
let allFields = [];
let filteredFields = [];

// DOM Elements
const searchInput = document.getElementById('searchInput');
const confidenceFilter = document.getElementById('confidenceFilter');
const tableBody = document.getElementById('tableBody');
const modal = document.getElementById('fieldModal');
const modalTitle = document.getElementById('modalTitle');
const modalBody = document.getElementById('modalBody');
const closeModal = document.getElementById('closeModal');

// Initialize the dashboard
document.addEventListener('DOMContentLoaded', function() {
    initializeLucideIcons();
    loadDashboardData();
    setupEventListeners();
    updateLastUpdated();
    
    // Add smooth scrolling for better UX
    document.documentElement.style.scrollBehavior = 'smooth';
});

// Initialize Lucide icons
function initializeLucideIcons() {
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// Load and populate dashboard data
function loadDashboardData() {
    const batch = dashboardData.batch[0];
    const fileData = batch.fileNameList[0];
    
    // Populate summary cards
    document.getElementById('totalFiles').textContent = batch.totalFiles;
    document.getElementById('packageStatus').textContent = batch.packageStatus;
    document.getElementById('packageId').textContent = batch.packageID;
    document.getElementById('packageName').textContent = batch.packageName;
    
    // Extract key information from fields
    const fields = fileData.fieldList;
    allFields = fields;
    filteredFields = [...fields];
    
    // Populate package details
    populatePackageDetails(fields);
    
    // Populate data table
    populateDataTable(filteredFields);
    
    // Update timeline dates
    updateTimelineDates(fields);
}

// Populate package details section
function populatePackageDetails(fields) {
    const fieldMap = {};
    fields.forEach(field => {
        fieldMap[field.fieldname] = field.extracteddata;
    });
    
    // Update package details
    const insuredName = fieldMap['Insured Name'] || 'N/A';
    const brokerName = fieldMap['Broker Name'] || 'N/A';
    const brokerEmail = fieldMap['Broker Contact Person Email'] || 'N/A';
    const underwriter = fieldMap['Credited Underwriter'] || 'N/A';
    const tivAmount = fieldMap['TIV Amount'] || 'N/A';
    const effectiveDate = fieldMap['Effective Date'] || 'N/A';
    
    document.getElementById('insuredName').textContent = insuredName;
    document.getElementById('brokerName').textContent = brokerName;
    document.getElementById('brokerEmail').textContent = brokerEmail;
    document.getElementById('underwriter').textContent = underwriter;
    document.getElementById('tivAmount').textContent = tivAmount;
    document.getElementById('effectiveDate').textContent = effectiveDate;
}

// Populate data table
function populateDataTable(fields) {
    tableBody.innerHTML = '';
    
    if (fields.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td colspan="5" style="text-align: center; padding: 2rem; color: var(--gray-500);">
                <i data-lucide="search-x" style="width: 2rem; height: 2rem; margin-bottom: 1rem;"></i>
                <div>No fields match your search criteria</div>
            </td>
        `;
        tableBody.appendChild(row);
        lucide.createIcons();
        return;
    }
    
    fields.forEach((field, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <div style="font-weight: 600; color: var(--gray-900);">${field.fieldname}</div>
                <div style="font-size: var(--font-size-xs); color: var(--gray-500); margin-top: 0.25rem;">
                    Row: ${field.rowid} | Column: ${field.columnname}
                </div>
            </td>
            <td>
                <div style="max-width: 300px; word-wrap: break-word;">
                    ${field.extracteddata || '<span style="color: var(--gray-400); font-style: italic;">No data</span>'}
                </div>
            </td>
            <td>
                <span class="confidence-score">${field.confidencescore}%</span>
            </td>
            <td>
                <span class="confidence-flag ${field.confidenceflag.toLowerCase()}">
                    <i data-lucide="${getConfidenceIcon(field.confidenceflag)}"></i>
                    ${field.confidenceflag}
                </span>
            </td>
            <td>
                <button class="action-btn" onclick="showFieldDetails(${index})">
                    <i data-lucide="eye"></i>
                    View Details
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
    
    // Reinitialize Lucide icons for new content
    lucide.createIcons();
}

// Get confidence icon based on flag
function getConfidenceIcon(flag) {
    switch (flag.toUpperCase()) {
        case 'GREY':
            return 'check-circle';
        case 'AMBER':
            return 'alert-triangle';
        case 'RED':
            return 'x-circle';
        default:
            return 'help-circle';
    }
}

// Update timeline dates
function updateTimelineDates(fields) {
    const fieldMap = {};
    fields.forEach(field => {
        fieldMap[field.fieldname] = field.extracteddata;
    });
    
    // Update timeline items with actual dates
    const timelineItems = document.querySelectorAll('.timeline-date');
    if (timelineItems.length >= 2) {
        const brokerDate = fieldMap['Date Submission received from Broker'];
        const operationsDate = fieldMap['Date Submission received by Operations'];
        
        if (brokerDate && timelineItems[0]) {
            timelineItems[0].textContent = formatDate(brokerDate);
        }
        if (operationsDate && timelineItems[1]) {
            timelineItems[1].textContent = formatDate(operationsDate);
        }
    }
}

// Format date for display
function formatDate(dateString) {
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    } catch (e) {
        return dateString;
    }
}

// Setup event listeners
function setupEventListeners() {
    // Search functionality
    searchInput.addEventListener('input', debounce(handleSearch, 300));
    
    // Filter functionality
    confidenceFilter.addEventListener('change', handleFilter);
    
    // Modal close functionality
    closeModal.addEventListener('click', hideModal);
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            hideModal();
        }
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            hideModal();
        }
        if (e.ctrlKey && e.key === 'f') {
            e.preventDefault();
            searchInput.focus();
        }
    });
    
    // Add loading states for better UX
    searchInput.addEventListener('focus', function() {
        this.parentElement.style.transform = 'scale(1.02)';
    });
    
    searchInput.addEventListener('blur', function() {
        this.parentElement.style.transform = 'scale(1)';
    });
}

// Debounce function for search
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Handle search functionality
function handleSearch() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    
    filteredFields = allFields.filter(field => {
        return field.fieldname.toLowerCase().includes(searchTerm) ||
               field.extracteddata.toLowerCase().includes(searchTerm) ||
               field.columnname.toLowerCase().includes(searchTerm);
    });
    
    // Apply confidence filter if active
    const confidenceValue = confidenceFilter.value;
    if (confidenceValue) {
        filteredFields = filteredFields.filter(field => 
            field.confidenceflag === confidenceValue
        );
    }
    
    populateDataTable(filteredFields);
    
    // Update search results count
    updateSearchResultsCount();
}

// Handle filter functionality
function handleFilter() {
    const confidenceValue = confidenceFilter.value;
    const searchTerm = searchInput.value.toLowerCase().trim();
    
    filteredFields = allFields.filter(field => {
        const matchesSearch = !searchTerm || 
            field.fieldname.toLowerCase().includes(searchTerm) ||
            field.extracteddata.toLowerCase().includes(searchTerm) ||
            field.columnname.toLowerCase().includes(searchTerm);
            
        const matchesFilter = !confidenceValue || field.confidenceflag === confidenceValue;
        
        return matchesSearch && matchesFilter;
    });
    
    populateDataTable(filteredFields);
    updateSearchResultsCount();
}

// Update search results count
function updateSearchResultsCount() {
    const existingCount = document.querySelector('.results-count');
    if (existingCount) {
        existingCount.remove();
    }
    
    if (filteredFields.length !== allFields.length) {
        const countElement = document.createElement('div');
        countElement.className = 'results-count';
        countElement.style.cssText = `
            font-size: var(--font-size-sm);
            color: var(--gray-600);
            margin-top: var(--spacing-sm);
        `;
        countElement.textContent = `Showing ${filteredFields.length} of ${allFields.length} fields`;
        
        const tableControls = document.querySelector('.table-controls');
        tableControls.appendChild(countElement);
    }
}

// Show field details in modal
function showFieldDetails(index) {
    const field = filteredFields[index];
    if (!field) return;
    
    modalTitle.textContent = field.fieldname;
    
    const roi = field.roi ? field.roi.split(',').map(n => parseInt(n)) : [0, 0, 0, 0];
    const hasValidRoi = roi.some(n => n > 0);
    
    modalBody.innerHTML = `
        <div style="display: grid; gap: var(--spacing-lg);">
            <div class="modal-field-group">
                <h4 style="color: var(--gray-900); margin-bottom: var(--spacing-md); display: flex; align-items: center; gap: var(--spacing-sm);">
                    <i data-lucide="info"></i>
                    Field Information
                </h4>
                <div style="display: grid; gap: var(--spacing-md);">
                    <div class="modal-field-item">
                        <strong>Field Name:</strong>
                        <span>${field.fieldname}</span>
                    </div>
                    <div class="modal-field-item">
                        <strong>Column Name:</strong>
                        <span>${field.columnname}</span>
                    </div>
                    <div class="modal-field-item">
                        <strong>Row ID:</strong>
                        <span>${field.rowid}</span>
                    </div>
                </div>
            </div>
            
            <div class="modal-field-group">
                <h4 style="color: var(--gray-900); margin-bottom: var(--spacing-md); display: flex; align-items: center; gap: var(--spacing-sm);">
                    <i data-lucide="file-text"></i>
                    Extracted Data
                </h4>
                <div class="extracted-data-box">
                    ${field.extracteddata || '<em style="color: var(--gray-500);">No data extracted</em>'}
                </div>
            </div>
            
            <div class="modal-field-group">
                <h4 style="color: var(--gray-900); margin-bottom: var(--spacing-md); display: flex; align-items: center; gap: var(--spacing-sm);">
                    <i data-lucide="target"></i>
                    Confidence Analysis
                </h4>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: var(--spacing-md);">
                    <div class="confidence-metric">
                        <div class="confidence-label">Confidence Score</div>
                        <div class="confidence-value">${field.confidencescore}%</div>
                        <div class="confidence-bar">
                            <div class="confidence-fill" style="width: ${field.confidencescore}%"></div>
                        </div>
                    </div>
                    <div class="confidence-metric">
                        <div class="confidence-label">Confidence Flag</div>
                        <span class="confidence-flag ${field.confidenceflag.toLowerCase()}" style="margin-top: var(--spacing-sm);">
                            <i data-lucide="${getConfidenceIcon(field.confidenceflag)}"></i>
                            ${field.confidenceflag}
                        </span>
                    </div>
                </div>
            </div>
            
            ${hasValidRoi ? `
            <div class="modal-field-group">
                <h4 style="color: var(--gray-900); margin-bottom: var(--spacing-md); display: flex; align-items: center; gap: var(--spacing-sm);">
                    <i data-lucide="map-pin"></i>
                    Region of Interest (ROI)
                </h4>
                <div class="roi-info">
                    <div class="roi-coordinates">
                        <div><strong>X:</strong> ${roi[0]}px</div>
                        <div><strong>Y:</strong> ${roi[1]}px</div>
                        <div><strong>Width:</strong> ${roi[2]}px</div>
                        <div><strong>Height:</strong> ${roi[3]}px</div>
                    </div>
                </div>
            </div>
            ` : ''}
        </div>
    `;
    
    // Add modal styles
    const style = document.createElement('style');
    style.textContent = `
        .modal-field-group {
            background: var(--gray-50);
            padding: var(--spacing-lg);
            border-radius: var(--radius-lg);
            border: 1px solid var(--gray-200);
        }
        
        .modal-field-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: var(--spacing-sm) 0;
            border-bottom: 1px solid var(--gray-200);
        }
        
        .modal-field-item:last-child {
            border-bottom: none;
        }
        
        .extracted-data-box {
            background: var(--white);
            padding: var(--spacing-lg);
            border-radius: var(--radius-md);
            border: 1px solid var(--gray-200);
            font-family: monospace;
            word-break: break-all;
        }
        
        .confidence-metric {
            text-align: center;
        }
        
        .confidence-label {
            font-size: var(--font-size-sm);
            color: var(--gray-600);
            margin-bottom: var(--spacing-xs);
        }
        
        .confidence-value {
            font-size: var(--font-size-xl);
            font-weight: 700;
            color: var(--gray-900);
            margin-bottom: var(--spacing-sm);
        }
        
        .confidence-bar {
            width: 100%;
            height: 8px;
            background: var(--gray-200);
            border-radius: 4px;
            overflow: hidden;
        }
        
        .confidence-fill {
            height: 100%;
            background: linear-gradient(90deg, var(--primary-blue), var(--primary-blue-light));
            transition: width 0.3s ease;
        }
        
        .roi-coordinates {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: var(--spacing-md);
            background: var(--white);
            padding: var(--spacing-lg);
            border-radius: var(--radius-md);
            border: 1px solid var(--gray-200);
        }
        
        .roi-coordinates > div {
            display: flex;
            justify-content: space-between;
            padding: var(--spacing-sm);
            background: var(--gray-50);
            border-radius: var(--radius-sm);
        }
    `;
    
    if (!document.querySelector('#modal-styles')) {
        style.id = 'modal-styles';
        document.head.appendChild(style);
    }
    
    modal.classList.add('active');
    lucide.createIcons();
    
    // Focus management for accessibility
    setTimeout(() => {
        closeModal.focus();
    }, 100);
}

// Hide modal
function hideModal() {
    modal.classList.remove('active');
}

// Update last updated timestamp
function updateLastUpdated() {
    const now = new Date();
    const lastUpdatedElement = document.getElementById('lastUpdated');
    if (lastUpdatedElement) {
        lastUpdatedElement.textContent = now.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
}

// Add smooth animations and interactions
function addInteractiveEffects() {
    // Add hover effects to cards
    const cards = document.querySelectorAll('.summary-card, .package-card, .timeline-item');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Add loading animation for table updates
    const originalPopulateDataTable = populateDataTable;
    populateDataTable = function(fields) {
        tableBody.style.opacity = '0.5';
        setTimeout(() => {
            originalPopulateDataTable(fields);
            tableBody.style.opacity = '1';
        }, 150);
    };
}

// Initialize interactive effects after DOM load
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(addInteractiveEffects, 500);
});

// Export functions for global access
window.showFieldDetails = showFieldDetails;
window.hideModal = hideModal;

// Add keyboard navigation for table
document.addEventListener('keydown', function(e) {
    if (e.target.tagName === 'BUTTON' && e.target.classList.contains('action-btn')) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            e.target.click();
        }
    }
});

// Add print functionality
function printDashboard() {
    window.print();
}

// Add export functionality (basic CSV export)
function exportToCSV() {
    const headers = ['Field Name', 'Extracted Data', 'Confidence Score', 'Confidence Flag', 'ROI'];
    const csvContent = [
        headers.join(','),
        ...filteredFields.map(field => [
            `"${field.fieldname}"`,
            `"${field.extracteddata}"`,
            field.confidencescore,
            field.confidenceflag,
            `"${field.roi}"`
        ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `insurance_submission_${dashboardData.batch[0].packageID}_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}

// Make export functions globally available
window.printDashboard = printDashboard;
window.exportToCSV = exportToCSV;
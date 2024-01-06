const taskContainer = document.getElementById('task-container');
const nextButton = document.getElementById('task-next-button'); 
const prevButton = document.getElementById('task-prev-button'); 
const pagination = document.getElementById('task-pagination'); 

const itemsPerPage = 5; // Number of items to show per page 
var items = [];
var totalPages;
var currentPage;
if(taskContainer && nextButton && prevButton)
{
    items = Array.from(taskContainer.getElementsByClassName('list-group-item task')); 

    if (items && items.length)
    {
        totalPages = Math.ceil(items.length / itemsPerPage);
        currentPage = 1;
    
        // Event listener for "Next" button 
        nextButton.addEventListener('click', () => { 
            console.log("next button clicked");
            if (currentPage < totalPages) { 
                currentPage++; 
                displayPage(currentPage); 
                updatePagination(); 
            } 
        }); 

        // Event listener for "Prev" button 
        prevButton.addEventListener('click', () => { 
            if (currentPage > 1) { 
                currentPage--; 
                displayPage(currentPage); 
                updatePagination();
            } 
        }); 

        // Initial page load 
        displayPage(currentPage); 
        updatePagination();
    }
}
 
// Function to display items for a specific page 
function displayPage(page) { 
    const startIndex = (page - 1) * itemsPerPage; 
    const endIndex = startIndex + itemsPerPage; 

    items.forEach((item, index) => { 
        if (index >= startIndex && index < endIndex) { 
            item.style.display = 'block'; 
        } else { 
            item.style.display = 'none'; 
        } 
    }); 
    
} 
  
// Function to update pagination buttons and page numbers 
function updatePagination() { 
    prevButton.disabled = currentPage === 1; 
    nextButton.disabled = currentPage === totalPages; 
} 
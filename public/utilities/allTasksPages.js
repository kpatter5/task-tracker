const taskContainer2 = document.getElementById('all-tasks-container');
console.log("taskContainer2=", taskContainer2);
const nextButton2 = document.getElementById('all-tasks-next-button'); 
console.log("nextButton2=", nextButton2);

const prevButton2 = document.getElementById('all-tasks-prev-button'); 
const tasksPagination2 = document.getElementById('all-tasks-pagination'); 

const itemsPerPage2 = 5; // Number of items to show per page 
var items2 = [];
var totalPages2;
var currentPage2;
if(taskContainer2 && nextButton2 && prevButton2)
{
    items2 = Array.from(taskContainer2.getElementsByClassName('list-group-item all-tasks')); 

    if (items2 && items2.length)
    {
        totalPages2 = Math.ceil(items2.length / itemsPerPage2);
        currentPage2 = 1;
    
        // Event listener for "Next" button 
        nextButton2.addEventListener('click', () => { 
            if (currentPage2 < totalPages2) { 
                currentPage2++; 
                displayPage2(currentPage2); 
                updatePagination2(); 
            } 
        }); 

        // Event listener for "Prev" button 
        prevButton2.addEventListener('click', () => { 
            if (currentPage2 > 1) { 
                currentPage2--; 
                displayPage2(currentPage2); 
                updatePagination2();
            } 
        }); 

        // Initial page load 
        displayPage2(currentPage2); 
        updatePagination2();
    }
}
 
// Function to display items for a specific page 
function displayPage2(page) { 
    console.log("inside displayPage2")
    const startIndex2 = (page - 1) * itemsPerPage2; 
    const endIndex2 = startIndex2 + itemsPerPage2; 
    console.log("items2=",items2);

    items2.forEach((item, index) => { 
        if (index >= startIndex2 && index < endIndex2) { 
            item.style.display = 'block'; 
        } else { 
            item.style.display = 'none'; 
        } 
    }); 

    
} 
  
// Function to update pagination buttons and page numbers 
function updatePagination2() { 
    prevButton2.disabled = currentPage2 === 1; 
    nextButton2.disabled = currentPage2 === totalPages2; 
} 
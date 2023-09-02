document.addEventListener("DOMContentLoaded", () => {
    const startButton = document.getElementById("startRecording");
    const stopButton = document.getElementById("stopRecording");
    const outputDiv = document.getElementById("output");
    const searchButton = document.getElementById("searchButton");
    const searchInput = document.getElementById("searchInput");
    const clearSearchButton = document.getElementById("clearSearchButton");
    const currentTasksDiv = document.getElementById("currentTasks");
    const originalTasks = currentTasksDiv.innerHTML;
    let isSearching = false;

    let tasks = [];

    startButton.addEventListener("click", () => {
        startButton.disabled = true;
        stopButton.disabled = false;

        // Display a message indicating conversion is in progress
        outputDiv.textContent = "Please wait, the conversion may take some time...";


        // Send a request to Flask when starting recording
        fetch("/start-recording")
            .then(response => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then(data => { //////////////////////
                const taskLabel = document.createElement("label");
                const taskCheckbox = document.createElement("input");
                taskCheckbox.type = "checkbox";
                taskCheckbox.className = "task-checkbox";

                // Apply the class to the label element
                taskLabel.className = "task-label";

                taskLabel.appendChild(taskCheckbox);
                taskLabel.appendChild(document.createTextNode(data.text));

                // Append the new task to the current tasks section
                const currentTasksDiv = document.getElementById("currentTasks");
                currentTasksDiv.appendChild(taskLabel);
                // Update output with converted text
                // outputDiv.textContent = data.text; 
            })
            .catch(error => {
                console.error("Error:", error);
                outputDiv.textContent = "An error occurred."; // Handle error in the UI
            });
    });

    stopButton.addEventListener("click", () => {
        startButton.disabled = false;
        stopButton.disabled = true;
    });

    function moveTask(taskElement, destination) {
        const currentTasksDiv = document.getElementById("currentTasks");
        const completedTasksDiv = document.getElementById("completedTasks");

        if (destination === "completed") {
            completedTasksDiv.appendChild(taskElement);
        } else if (destination === "current") {
            currentTasksDiv.appendChild(taskElement);
        }
    }

    // Listen for checkbox changes
    document.addEventListener("change", (event) => {
        if (event.target.type === "checkbox") {
            const taskLabel = event.target.parentNode;
            const destination = event.target.checked ? "completed" : "current";
            moveTask(taskLabel, destination);
        }
    });

    ////////
    searchButton.addEventListener("click", () => {
        const searchTerm = searchInput.value.trim().toLowerCase();
        if (searchTerm === "") {
            return;
        }

        searchTasks(searchTerm);
    });

    clearSearchButton.addEventListener("click", () => { // Modify this event listener
        clearSearch();
    });


    function clearSearch() {
        currentTasksDiv.innerHTML = originalTasks;
        isSearching = false; // Reset the search flag
    }

    function searchTasks(searchTerm) {
        const tasks = document.getElementsByClassName("task-label");
        for (const task of tasks) {
            const taskText = task.textContent.toLowerCase();
            const highlightedText = taskText.replace(
                new RegExp(`\\b${searchTerm}\\b`, "gi"),
                match => `<span class="highlighted-word">${match}</span>`
            );
            task.innerHTML = highlightedText;

            // Preserve checkboxes during search
            task.innerHTML = `<input type="checkbox" class="task-checkbox">${highlightedText}`;
        }
        isSearching = true; // Set the search flag
    }
});
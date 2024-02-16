// UUUUUUUUUUUUUUUUUUUUUUUGGGGGGGGGGGGGGGGGGGGGGGHHHHHHHHHHHHHHHHHHHHHHH
// TEST AND CHANGE FOR UTC- TIMES, BECAUSE WHEN IT'S E.G. ALREADY THE 15TH FOR UTC TIME BUT ONLY THE 14TH FOR UTC-07:00

// Function to move articles to the correct sections
function moveArticlesToCorrectSection() {
    const sections = document.querySelectorAll('.events'); // Get all sections
    const articlesToMove = []; // Array to store articles that need to be moved

    // Iterate through each section
    sections.forEach(section => {
        const sectionId = section.getAttribute('id');
        const sectionDate = new Date(sectionId).toDateString();
        const articles = section.querySelectorAll('.event'); // Get all articles in the section

		// Move articles stored in the array to the correct section
        const sectionToMoveTo = moveArticles(articlesToMove, section, sectionDate);
		// Clear the array because every article has been moved 
        articlesToMove.length = 0;
		// If a new section has been created add it to the parent container before the current section
        if (sectionToMoveTo !== section) {
            section.parentElement.insertBefore(sectionToMoveTo, section);
        }

        // Iterate through articles in the section
        articles.forEach(article => {
            const articleDateTime = new Date(article.querySelector('.event__time').getAttribute('datetime'));

            // Check if the article's date matches the section's date
            if (articleDateTime.toDateString() !== sectionDate) {
                // If not, add it to the front the array of articles to be moved
                articlesToMove.unshift({
                    date: articleDateTime.toDateString(),
                    articleElement: article
                });
                article.remove(); // Remove the article from the section
            }
        });
    });
	if(articlesToMove.length) {
		// Move any articles left in the array to a newly created section and append it to the back of the container
		document.querySelector('.events__container').append(moveArticles(articlesToMove));
    }
}

// Function to move articles to the appropriate section
function moveArticles(articlesToMove, sectionToMoveTo = null, sectionToMoveToDate = null) {
    articlesToMove.forEach(entry => {
        // If the article belongs to this section, prepend it to the section's articles
        // Otherwise, create a new section before this one
        if (entry.date !== sectionToMoveToDate) {
            sectionToMoveTo = createSection(new Date(entry.date));
            sectionToMoveToDate = entry.date;
        }
        sectionToMoveTo.querySelector(".events__articles").prepend(entry.articleElement);
    });
    return sectionToMoveTo;
}

// Function to create a new section element with a given date
function createSection(date) {
    // Create the section element
    const section = document.createElement("section");
    section.setAttribute("id", date.toISODateString());
    section.classList.add("events");

    // Create the header element
    const header = document.createElement("header");
    header.classList.add("events__title");

    // Create the h4 element
    const h4 = document.createElement("h4");
    h4.classList.add("events__title-text");
    h4.setAttribute("datetime", date.toDateString());
    h4.textContent = date.toLocalDateString();

    // Append h4 to header
    header.appendChild(h4);

    // Create the div for articles
    const articlesDiv = document.createElement("div");
    articlesDiv.classList.add("events__articles");

    // Append header and articlesDiv to section
    section.appendChild(header);
    section.appendChild(articlesDiv);

    return section;
}

// Function to format date as YYYY-MM-DD format
Date.prototype.toISODateString = function() {
    const year = this.getFullYear();
    const month = `${this.getMonth() + 1}`.padStart(2, "0");
    const day = `${this.getDate()}`.padStart(2, "0");
    return `${year}-${month}-${day}`;
};

// Function to format date as local long date string
Date.prototype.toLocalDateString = function() {
    const options = {
        day: "numeric",
        month: "long",
        year: "numeric"
    };
    return this.toLocaleDateString(navigator.language, options);
};

// Call the function to move articles to correct sections
moveArticlesToCorrectSection();




/************************/


document.addEventListener("DOMContentLoaded", () => {
	const eventTitles = document.querySelectorAll(".events__title__text");
	eventTitles.forEach((eventTitle) => {
		const utcTime = new Date(eventTitle.getAttribute("datetime"));
		eventTitle.setAttribute("datetime", utcTime.toDateString());
		eventTitle.textContent = utcTime.toLocalDateString();
	});

	const events = document.querySelectorAll(".event__time");
	events.forEach((event) => {
		// Get UTC time from element
		const utcTime = new Date(parseInt(event.getAttribute("datetime")) * 1000);
		// Set attribute and textcontent to formatted UTC time
		event.setAttribute("datetime", utcTime.toString());
		event.textContent = utcTime.toLocalTimeString();
	});
});

// Function to format date as YYYY-MM-DD format
Date.prototype.toISODateString = function () {
	const year = this.getFullYear();
	const month = `${this.getMonth() + 1}`.padStart(2, "0");
	const day = `${this.getDate()}`.padStart(2, "0");
	return `${year}-${month}-${day}`;
};

// Function to format date as local long date string
Date.prototype.toLocalDateString = function () {
	const options = { day: "numeric", month: "long", year: "numeric" };
	return this.toLocaleDateString(navigator.language, options);
};

// Function to format time as local time string
Date.prototype.toLocalTimeString = function () {
	const options = { hour: "2-digit", minute: "2-digit" };
	const timezoneOffset = this.getTimezoneOffset();
	return `${this.toLocaleTimeString(navigator.language, options)} UTC${timezoneOffset >= 0 ? "-" : "+"}${Math.abs(Math.floor(timezoneOffset / 60))
		.toString()
		.padStart(2, "0")}:${Math.abs(timezoneOffset % 60)
		.toString()
		.padStart(2, "0")}`;
};

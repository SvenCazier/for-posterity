document.addEventListener("DOMContentLoaded", function() {
	const timeZoneOffset = new Date().getTimezoneOffset();

	// Only perform this if client is not on UTC time
	if(timeZoneOffset !== 0) {
		const eventsContainer = document.querySelector(".events__container");
		const sectionsArray = [];
		const options = {year: 'numeric', month: 'short', day: 'numeric'}
		
		// Iterate through each section in the events container
		eventsContainer.querySelectorAll(".events").forEach(function(section) {
			// Push section to the sectionsArray
			sectionsArray.push(section);
		});

		// Clear the events container
		eventsContainer.innerHTML = "";

		// Loop over sectionsArray after clearing the eventsContainer
		for(let i = 0; i < sectionsArray.length; i++) {
			const articlesToMoveArray = [];
			// Get section title datetime
			const sectionTitleDatetime = getFormattedDateForComparison(sectionsArray[i], ".events__title__text", options);

			// Get article datetimes and convert to local datetime
			sectionsArray[i].querySelectorAll(".event").forEach(article => {
				const articleDateLocal = getFormattedDateForComparison(article, ".event__time", options);
				// If getTimezoneOffset() returns a negative number those that are wrong need to always be moved to a next section and vice versa
				// This combines checking for if they're in the wrong section and whether to push (needs to be moved before) or unshift (needs to be moved after) them
				if (sectionTitleDatetime > articleDateLocal) {
					console.log("Needs to be moved a section before");
					articlesToMoveArray.push({formattedArticleDate: articleDateLocal, articleElement: article})
					
				} else if (sectionTitleDatetime < articleDateLocal) {
					console.log("Need to be moved a section after");
					articlesToMoveArray.unshift({formattedArticleDate: articleDateLocal, articleElement: article})
				}
			});
			
			// The change between UTC and local time can never be more than 12 hours, so if they need to be moved it's to the day before/after
			articlesToMoveArray.forEach(entry => {
				// If timeZoneOffset is smaller than 0 they need to be moved forward else backward
				if(timeZoneOffset < 0) {
					const nextSection = sectionsArray[i+1];
					if(nextSection && getFormattedDateForComparison(nextSection, ".events__title__text", options) === entry.formattedArticleDate) {
						// Section to be moved to exists => prepend article
						nextSection.querySelector(".events__articles").prepend(entry.articleElement);
					}
					else {
						// Section does not exist => create new => prepend article => put new section in eventsContainer before current section
						createSection(entry.formattedArticleDate).prepend(entry.articleElement);
					}
				}
				else {
					const previousSection = sectionsArray[i+1];
					if(previousSection && getFormattedDateForComparison(previousSection, ".events__title__text", options) === entry.formattedArticleDate) {
						// Section to be moved to exists
					}
				}
			});
			// Clear articles array
			articlesToMoveArray.length = 0;
		}
		
		
		// Remove empty sections
	}
});

function getFormattedDateForComparison(el, className, options) {
	return new Date(el.querySelector(className).getAttribute("datetime")).toLocaleDateString(options);
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
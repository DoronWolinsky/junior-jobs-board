const jobsList = document.getElementById("jobs");

async function fetchJobs() {
    const res = await fetch("http://localhost:3000/jobs");
    const jobs = await res.json();

    jobsList.innerHTML = "";
    jobs.forEach(job => {
        const li = document.createElement("li");
        li.textContent = `${job.title} at ${job.company} (${job.location})`;
        jobsList.appendChild(li);
    });
}

const jobForm = document.getElementById("job-form");

jobForm.addEventListener("submit", async (e) => {
    e.preventDefault(); // Unable default form submission behavior

    const job = {
        title: document.getElementById("title").value,
        company: document.getElementById("company").value,
        location: document.getElementById("location").value,
        tags: document.getElementById("tags").value,
        description: document.getElementById("description").value
    };

    const res = await fetch("http://localhost:3000/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(job)
    });

    const data = await res.json();
    console.log("Added job:", data);

    fetchJobs(); // Refresh job list
    jobForm.reset(); // Clear form
});

// Initial fetch
fetchJobs();


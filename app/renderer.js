require("dotenv").config(); 
const token = process.env.GH_TOKEN


async function fetchGitHub(username) {
  const finalUsername = username || "piyushpatelcodes";
  
  // setLoading(true);
  // setError(null); // Reset error message
  await axios
    .get(`https://api.github.com/users/${finalUsername}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Adding token to headers
      },
    })
    .then(async (response) => {
        const data = response.data
        document.getElementById("avatar").src = data.avatar_url;
        document.getElementById("username").innerText = data.name.toUpperCase();
  document.getElementById("followers").innerText = `${data.followers}`;
  document.getElementById("repos").innerText = `${data.public_repos}`;
  document.getElementById("usergithubsvg").onclick = function () {
    window.open(`https://github.com/${finalUsername}`, "_blank");
  };
  

//    document.getElementById("github-graph").src = `https://ghchart.rshah.org/34B3F1/${username}`;
const graphContainer = document.getElementById("github-graph");

  try {
    const res = await axios.get(`https://github-contributions-api.jogruber.de/v4/${username}?y=last`);
    const { contributions } = res.data;

    if (contributions) {
      const currentMonth = new Date().getMonth();
      const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;

      const filtered = contributions.filter((c) => {
        const contributionDate = new Date(c.date);
        return (
          contributionDate.getMonth() === currentMonth ||
          contributionDate.getMonth() === lastMonth
        );
      });

      filtered.forEach((c) => {
        const dot = document.createElement("div");
        dot.classList.add("graph-dot");
        dot.style.background = c.count > 0 ? `rgba(0, 255, 200, ${c.count / 10})` : "rgba(255, 255, 255, 0.1)";
        dot.setAttribute("data-date", c.date);
        dot.setAttribute("data-count", c.count);
        dot.onmouseover = (e) => {
          const tooltip = document.getElementById("tooltip");
          tooltip.innerHTML = `${c.date} <br> ${c.count} contributions`;
          tooltip.style.top = `${e.clientY - 80}px`;
          tooltip.style.left = `${e.clientX - 80}px`;
          tooltip.classList.add("visible");
        };
        dot.onmouseleave = () => {
          document.getElementById("tooltip").classList.remove("visible");
        };

        graphContainer.appendChild(dot);
      });
    }
  } catch (error) {
    console.log("Failed to fetch GitHub data", error);
  }

      // setLoading(false);
    })
    .catch((error) => {
      // setLoading(false);
      if (error.response && error.response.status === 403) {
        // setError("Rate limit exceeded. Please try again later.");
      } else {
        // setError("User not found or invalid GitHub username.");
      }
    });
  
}

async function fetchBadges(username) {
  const response = await axios.get(
    `https://api.github.com/users/${username}/events`,
    {
      headers: {
        Authorization: `Bearer ${token}`, // Adding token to headers
      },
    }
  );
  const data = await response
  if (data.length > 0) {
    document.getElementById("badges").innerHTML = `<span>🔥 GitHub Streak King</span>`;
  }

   
}

// fetchGitHub("piyushpatelcodes");

// fetchBadges("piyushpatelcodes");


function updateUser() {
  const username = document.getElementById("inputusername").value.trim();
  if (username) {
    fetchGitHub(username);
    fetchBadges(username);
  } else {
    alert("Please enter a valid username");
  }
}
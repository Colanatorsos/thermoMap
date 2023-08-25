const graphContainer = document.getElementById("graph");
const currentDate = new Date();
const startDate = new Date(currentDate);
startDate.setDate(startDate.getDate() - 50 * 7);

fetch("https://dpg.gg/test/calendar.json")
  .then((response) => response.json())
  .then((contributionData) => {
    createContributionGraph(contributionData);
  })
  .catch((error) => {
    console.error("Ошибочка сбора инфы! :)))", error);
  });

const hideTooltips = () => {
  const tooltips = document.querySelectorAll(".tooltip");
  tooltips.forEach((tooltip) => {
    tooltip.style.opacity = 0;
  });
};

const createContributionGraph = (contributionData) => {
  for (let i = 0; i < 357; i++) {
    const cellDate = new Date(startDate);
    cellDate.setDate(cellDate.getDate() + i);

    const cell = document.createElement("div");
    cell.className = "cell";

    const dateString = cellDate.toISOString().split("T")[0];

    if (contributionData[dateString]) {
      const contributions = contributionData[dateString];

      switch (true) {
        case contributions >= 30:
          cell.classList.add("very-high-contribution");
          break;
        case contributions >= 20:
          cell.classList.add("high-contribution");
          break;
        case contributions >= 10:
          cell.classList.add("medium-contribution");
          break;
        case contributions >= 1:
          cell.classList.add("low-contribution");
          break;
        default:
          cell.classList.add("no-contribution");
      }
    } else {
      cell.classList.add("no-contribution");
    }

    const tooltip = document.createElement("div");
    tooltip.className = "tooltip";
    cell.appendChild(tooltip);

    cell.addEventListener("click", () => {
      hideTooltips();
      if (tooltip.style.opacity === "1") {
        tooltip.style.opacity = 0;
      } else {
        const contributions = contributionData[dateString] || 0;
        const formattedDate = new Intl.DateTimeFormat("en-US", {
          month: "numeric",
          day: "numeric",
          year: "numeric",
          weekday: "long",
        }).format(cellDate);

        tooltip.textContent = `${contributions} Контрибуции\n${formattedDate}`;
        tooltip.style.opacity = 1;

        setTimeout(() => {
          tooltip.style.opacity = 0;
        }, 1500);
      }
    });
    graphContainer.appendChild(cell);
  }
};

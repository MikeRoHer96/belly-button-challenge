// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json")
    .then((data) => {
      // Log the data to the console
      console.log(data);

      // Get the metadata field
      const metadata = data.metadata;

      // Filter the metadata for the object with the desired sample number
      const result = metadata.find((meta) => meta.id.toString() === sample);

      // Use d3 to select the panel with id of `#sample-metadata`
      const panel = d3.select("#sample-metadata");

      // Clear any existing metadata
      panel.html("");

      // Check if a result was found and loop through key-value pairs
      if (result) {
        Object.entries(result).forEach(([key, value]) => {
          panel.append("p").text(`${key.toUpperCase()}: ${value}`);
        });
      } else {
        // Display a message if no metadata was found
        panel.append("p").text("No metadata found for the selected sample.");
      }
    })
    .catch((error) => {
      // Catch errors in loading or processing the data
      console.error("Error loading metadata:", error);
    });
}
// Function to build both charts
function buildCharts(sample) {
  // Fetch the JSON data
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json")
    .then((data) => {
      console.log(data); // Log the data to check if it's loaded properly

      // Get the samples field
      const samples = data.samples;

      // Filter the samples for the object with the desired sample number
      const result = samples.find((sampleObj) => sampleObj.id === sample);

      if (!result) {
        console.error(`No data found for sample: ${sample}`);
        return;
      }

      // Get the otu_ids, otu_labels, and sample_values
      const otuIds = result.otu_ids;
      const otuLabels = result.otu_labels;
      const sampleValues = result.sample_values;

      // Build a Bubble Chart
      const bubbleTrace = {
        x: otuIds,
        y: sampleValues,
        text: otuLabels,
        mode: "markers",
        marker: {
          size: sampleValues,
          color: otuIds,
          colorscale: "Earth",
        },
      };

      const bubbleLayout = {
        title: "OTU ID vs. Sample Values",
        xaxis: { title: "OTU ID" },
        yaxis: { title: "Sample Values" },
        hovermode: "closest",
      };

      // Render the Bubble Chart
      Plotly.newPlot("bubble", [bubbleTrace], bubbleLayout);

      // For the Bar Chart, map the otu_ids to a list of strings for your yticks
      const topSampleValues = sampleValues.slice(0, 10).reverse();
      const topOtuIds = otuIds.slice(0, 10).reverse().map((id) => `OTU ${id}`);
      const topOtuLabels = otuLabels.slice(0, 10).reverse();

      // Build a Bar Chart
      const barTrace = {
        x: topSampleValues,
        y: topOtuIds,
        text: topOtuLabels,
        type: "bar",
        orientation: "h",
      };

      const barLayout = {
        title: "Top 10 OTUs Found",
        xaxis: { title: "Sample Values" },
        yaxis: { title: "OTU IDs" },
      };

      // Render the Bar Chart
      Plotly.newPlot("bar", [barTrace], barLayout);
    })
    .catch((error) => {
      console.error("Error loading or processing data:", error);
    });
}
// Function to run on page load
function init() {
  // Fetch the JSON data
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json")
    .then((data) => {
      console.log(data); // Log the data to check if it's loaded properly

      // Get the names field
      const sampleNames = data.names;

      // Use d3 to select the dropdown with id of `#selDataset`
      const dropdown = d3.select("#selDataset");

      // Populate the dropdown with sample names
      sampleNames.forEach((sample) => {
        dropdown.append("option").text(sample).property("value", sample);
      });

      // Get the first sample from the list
      const firstSample = sampleNames[0];

      // Build charts and metadata panel with the first sample
      buildCharts(firstSample);
      buildMetadata(firstSample);
    })
    .catch((error) => console.error("Error loading data:", error));
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();

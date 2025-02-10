import React, {useEffect} from "react";
import {
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Typography,
    OutlinedInput,
    ListItemText,
    Checkbox
} from "@mui/material";

import useUmapStore from "../../store/UmapStore.js";
import useDataStore from "../../store/DataStore.js"; // Import CSS file

import "./UmapView.css";
import {useParams} from "react-router-dom";

function UmapView() {
    const {sampleRecords,fetchSampleData} = useDataStore();
    useEffect(() => {
        fetchSampleData({project_id: "all"})
    }, [fetchSampleData]);

    const { project_id } = useParams(); // Extracts project_id from the URL

    const geneRecords = [
      "Gene 1",
      "Gene 2",
      "Gene 3",
      "Gene 4",
      "Gene 5",
      "Gene 6",
    ]
    const { selectedSamples, setSelectedSamples, selectedGenes, setSelectedGenes } = useUmapStore();

    const handleSampleChange = (event) => {
        const {target: { value },} = event;
        setSelectedSamples(
          // On autofill we get a stringified value.
          typeof value === 'string' ? value.split(',') : value,
        );
    };

    const handleGeneChange = (event) => {
        const {target: { value },} = event;
        setSelectedGenes(
          // On autofill we get a stringified value.
          typeof value === 'string' ? value.split(',') : value,
        );
    };


  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
      PaperProps: {
        style: {
          maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
          width: 250,
        },
      },
    };
  return (
    <div className="umap-container">
      {/* Right Panel for Sample & Gene Selection (20%) */}
      <div className="umap-panel">
        <Typography variant="h6">Select Samples & Genes</Typography>

        {/* Sample Selection */}
        <FormControl sx={{ m: 1, width: 300 }} size="small">
           <InputLabel id="sample-multiple-checkbox-label">Samples</InputLabel>
            <Select
              labelId="sample-multiple-checkbox-label"
              id="sample-multiple-checkbox"
              multiple
              value={selectedSamples}
              onChange={handleSampleChange}
              input={<OutlinedInput label="Samples" />}
              renderValue={(selected) => selected.join(',')}
              MenuProps={MenuProps}
             >
              {sampleRecords.map((s_i) => (
                <MenuItem key={s_i.sample_id} value={s_i.sample_id}>
                  <Checkbox checked={selectedSamples.includes(s_i.sample_id)} />
                  <ListItemText primary={s_i.sample_id} />
                </MenuItem>
              ))}
            </Select>
        </FormControl>

        {/* Gene Selection */}
        <FormControl sx={{ m: 1, width: 300 }} size="small">
            <InputLabel id="gene-multiple-checkbox-label">Genes</InputLabel>
            <Select
              labelId="gene-multiple-checkbox-label"
              id="gene-multiple-checkbox"
              multiple
              value={selectedGenes}
              onChange={handleGeneChange}
              input={<OutlinedInput label="Samples" />}
              renderValue={(selected) => selected.join(',')}
              MenuProps={MenuProps}
              >
                 {geneRecords.map((g_i) => (
                <MenuItem key={g_i} value={g_i}>
                  <Checkbox checked={selectedGenes.includes(g_i)} />
                  <ListItemText primary={g_i} />
                </MenuItem>
              ))}
              </Select>
        </FormControl>
      </div>
         {/* Left UMAP Plot Area (80%) */}
      <div className="umap-main">
        <Typography variant="h5">UMAP Plot</Typography>
      </div>
    </div>
  );
}

export default UmapView;

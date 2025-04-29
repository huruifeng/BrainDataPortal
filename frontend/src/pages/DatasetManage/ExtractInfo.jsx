// src/components/ExtractInfo.jsx

import React, {useState, forwardRef, useImperativeHandle, useEffect} from 'react';
import {Box, Typography, Grid, TextField, Divider, MenuItem, FormControl, InputLabel, Select} from '@mui/material';
import useDatasetManageStore from "../../store/DatasetManageStore.js";

const ExtractInfo = forwardRef((props, ref) => {

    const {seuratObjects, selectedSeurat,setSelectedSeurat, fetchSeuratObjects} = useDatasetManageStore()

    useEffect(() => {
        fetchSeuratObjects();
    }, []);




    const [datasetInfo, setDatasetInfo] = useState({
        dataset_id: '',
        dataset_name: '',
        description: '',
        PI_full_name: '',
        PI_email: '',
        first_contributor: '',
        first_contributor_email: '',
        other_contributors: '',
        support_grants: '',
        other_funding_source: '',
        publication_DOI: '',
        publication_PMID: '',
        n_samples: '',
        brain_super_region: '',
        brain_region: '',
        sample_info: '',
        assay: '',
    });

    const [studyInfo, setStudyInfo] = useState({
        study_id: '',
        study_name: '',
        study_description: '',
        team_name: '',
        lab_name: '',
        submitter_name: '',
        submitter_email: '',
    });

    const [protocolInfo, setProtocolInfo] = useState({
        protocol_id: '',
        protocol_name: '',
        version: '',
        sample_collection_summary: '',
        cell_extraction_summary: '',
        lib_prep_summary: '',
        data_processing_summary: '',
        github_url: '',
        protocols_io_DOI: '',
        other_reference: '',
    });

    useImperativeHandle(ref, () => ({
        validateFields,
        collectData,
    }));

    const requiredDataset = ['dataset_id', 'dataset_name'];
    const requiredStudy = ['study_id', 'study_name'];
    const requiredProtocol = ['protocol_id', 'protocol_name'];

    const validateFields = () => {
        if (!selectedSeurat) return false;
        for (let key of requiredDataset) if (!datasetInfo[key]) return false;
        for (let key of requiredStudy) if (!studyInfo[key]) return false;
        for (let key of requiredProtocol) if (!protocolInfo[key]) return false;
        return true;
    };

    const collectData = () => ({
        seurat_object: selectedSeurat,
        dataset_info: datasetInfo,
        study_info: studyInfo,
        protocol_info: protocolInfo,
    });

    const handleChange = (section, field) => (e) => {
        if (section === 'dataset') {
            setDatasetInfo({...datasetInfo, [field]: e.target.value});
        } else if (section === 'study') {
            setStudyInfo({...studyInfo, [field]: e.target.value});
        } else if (section === 'protocol') {
            setProtocolInfo({...protocolInfo, [field]: e.target.value});
        }
    };

    return (
        <Box>

            {/* Seurat Object Selector */}
            <Typography variant="h5" fontWeight="bold" mb={2}>
                Select Seurat Object
            </Typography>
            <FormControl fullWidth size="small" sx={{mb: 4}}>
                <InputLabel id="seurat-select-label">Seurat Object</InputLabel>
                <Select
                    labelId="seurat-select-label"
                    value={selectedSeurat}
                    label="Seurat Object"
                    onChange={(e) => setSelectedSeurat(e.target.value)}
                >
                    {seuratObjects.map((obj) => (
                        <MenuItem key={obj} value={obj}>
                            {obj}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            {/* Dataset Info */}
            <Typography variant="h5" fontWeight="bold" mb={2}>
                Dataset Information
            </Typography>
            <Grid container spacing={3}>
                {Object.entries(datasetInfo).map(([key, value]) => (
                    <Grid item xs={12} md={['description', 'sample_info'].includes(key) ? 12 : 6} key={key}>
                        <TextField
                            label={key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            fullWidth
                            size="small"
                            required={requiredDataset.includes(key)}
                            value={value}
                            multiline={['description', 'sample_info'].includes(key)}
                            minRows={['description', 'sample_info'].includes(key) ? 3 : 1}
                            onChange={handleChange('dataset', key)}
                        />
                    </Grid>
                ))}
            </Grid>

            <Divider sx={{my: 5}}/>

            {/* Study Info */}
            <Typography variant="h5" fontWeight="bold" mb={2}>
                Study Information
            </Typography>
            <Grid container spacing={3}>
                {Object.entries(studyInfo).map(([key, value]) => (
                    <Grid item xs={12} md={key === 'study_description' ? 12 : 6} key={key}>
                        <TextField
                            label={key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            fullWidth
                            size="small"
                            required={requiredStudy.includes(key)}
                            value={value}
                            multiline={key === 'study_description'}
                            minRows={key === 'study_description' ? 3 : 1}
                            onChange={handleChange('study', key)}
                        />
                    </Grid>
                ))}
            </Grid>

            <Divider sx={{my: 5}}/>

            {/* Protocol Info */}
            <Typography variant="h5" fontWeight="bold" mb={2}>
                Protocol Information
            </Typography>
            <Grid container spacing={3}>
                {Object.entries(protocolInfo).map(([key, value]) => (
                    <Grid item xs={12} md={[
                        'sample_collection_summary',
                        'cell_extraction_summary',
                        'lib_prep_summary',
                        'data_processing_summary',
                        'other_reference'
                    ].includes(key) ? 12 : 6} key={key}>
                        <TextField
                            label={key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            fullWidth
                            size="small"
                            required={requiredProtocol.includes(key)}
                            value={value}
                            multiline={[
                                'sample_collection_summary',
                                'cell_extraction_summary',
                                'lib_prep_summary',
                                'data_processing_summary',
                                'other_reference'
                            ].includes(key)}
                            minRows={[
                                'sample_collection_summary',
                                'cell_extraction_summary',
                                'lib_prep_summary',
                                'data_processing_summary',
                                'other_reference'
                            ].includes(key) ? 3 : 1}
                            onChange={handleChange('protocol', key)}
                        />
                    </Grid>
                ))}
            </Grid>

        </Box>
    );
});

export default ExtractInfo;

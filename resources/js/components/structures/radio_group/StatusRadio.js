import * as React from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

export const StatusRadio = React.memo(({ ...props }) => {

    const handleChange = (event) => {
        props.setControlledInput({ ...props.controlledInput, ["status"]: event.currentTarget.value });
    }

    return (
        <FormControl>
            <FormLabel>{props.title}</FormLabel>
            <RadioGroup
                row
                name="status"
                defaultValue={props.default}
                onChange={handleChange}
            >
                <FormControlLabel value={1} control={<Radio />} label={"Ativo"} key={1} />
                <FormControlLabel value={0} control={<Radio />} label={"Inativo"} key={0} />
            </RadioGroup>
        </FormControl>
    );
});

import * as React from "react";
import  { Component } from 'react';
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import FormHelperText from "@mui/joy/FormHelperText";
import Input from "@mui/joy/Input";
import Button from "@mui/joy/Button";
import Box from "@mui/joy/Box";
import { variables } from "./variables";
import axios from "axios";



export class Form extends Component {
    static displayName = Form.name;

    constructor(props) {
        super(props);
        this.state = {
            email: "",
            status: "initial",
            file: {}
        };
    }



    handleFileChange = (e) => {
        if (e.target.files) {
            this.setState({ file: e.target.files[0] });
        }
    };

    handleSubmit = async (event) => {
        event.preventDefault();
        if (!this.state.file) {
            this.setState({ status: "no file" });
            return;
        }
        this.setState({ status: "loading" });

        const formData = new FormData();
        formData.append("email", this.state.email);
        formData.append("uploadedFile", this.state.file);

        await axios({
            method: "post",
            url: variables.API_URL_Upload,
            data: formData,
            headers: { "Content-Type": "multipart/form-data" }
        })
            .then((response) => {
                // Handle response
                this.setState({ status: "sent" });
                console.log(response.data);
            })
            .catch((err) => {
                // Handle errors
                this.setState({ status: "failure" });
                console.error(err);
            })
    }

    render() {
        return (
            <form onSubmit={e => this.handleSubmit(e)} id="demo">
                <FormControl>
                    <FormLabel
                        sx={(theme) => ({
                            "--FormLabel-color": theme.vars.palette.primary.plainColor
                        })}
                    >
                        Enter user email and add .docx file
                    </FormLabel>

                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            marginBottom: "1%"
                        }}
                    >
                        <Button
                            sx={{ marginRight: "5%" }}
                            variant="outlined"
                            component="label"
                        >
                            Upload
                            <input
                                hidden
                                accept=".docx"
                                multiple
                                type="file"
                                onChange={e => this.handleFileChange(e)}
                            />
                        </Button>
                        {this.state.file?.name}
                    </Box>

                    <Input
                        sx={{ "--Input-decoratorChildHeight": "45px" }}
                        placeholder="mail@mui.com"
                        type="email"
                        required
                        value={this.state.email}
                        onChange={(event) =>
                            this.setState({ email: event.target.value, status: "initial" })
                        }
                        error={this.state.status === "failure"}
                        endDecorator={
                            <Button
                                variant="solid"
                                color="primary"
                                loading={this.state.status === "loading"}
                                type="submit"
                                sx={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
                            >
                                Submit
                            </Button>
                        }
                    />

                    {this.state.status === "failure" && (
                        <FormHelperText
                            sx={(theme) => ({ color: theme.vars.palette.danger[400] })}
                        >
                            Oops! something went wrong, please try again later.
                        </FormHelperText>
                    )}

                    {this.state.status === "sent" && (
                        <FormHelperText
                            sx={(theme) => ({ color: theme.vars.palette.primary[400] })}
                        >
                            You are all set!
                        </FormHelperText>
                    )}

                    {this.state.status === "no file" && (
                        <FormHelperText
                            sx={(theme) => ({ color: theme.vars.palette.danger[400] })}
                        >
                            Oops! please upload file.
                        </FormHelperText>
                    )}
                </FormControl>
            </form>
        );
    }

}
    


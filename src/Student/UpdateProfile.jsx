import React, { Component } from "react";
import {
  Card,
  CardContent,
  Grid,
  Button,
  Avatar,
  List,
  ListItem,
  ListItemText
} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import Dialog from "@material-ui/core/Dialog";
import TextField from "@material-ui/core/TextField";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import FolderIcon from "@material-ui/icons/Folder";
import SimpleStorageContract from "../contracts/SimpleStorage.json";
import getWeb3 from "../utils/getWeb3";
import ipfs from "../ipfs";
class UploadPage extends Component {
  state = {
    storageValue: 0,
    web3: null,
    accounts: null,
    contract: null,
    name: "",
    open: false,
    profilepic: ""
  };

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  disable = () => {
    return this.state.name.length > 0 ? false : true;
  };

  setName = e => {
    {
      this.setState({ name: e.target.value });
    }
  };
  updateProfile = async () => {
    const { accounts, contract } = this.props;

    console.log(contract);

    await contract.methods
      .updateProf(this.state.name, this.state.profilepic, accounts[0])
      .send({ from: accounts[0] });

    const response = await contract.methods.getProfile(accounts[0]).call();
    console.log(response[0] + "updated");
    {
      this.handleClose();
    }
  };
  ClickOpenGetProfile = async () => {
    const { accounts, contract } = this.props;
    const response = await contract.methods.getProfile(accounts[0]).call();
    this.setState({ name: response[0] });
    this.setState({ profilepic: response[1] });
    console.log(contract);
    {
      this.handleClickOpen();
    }
  };

  captureFile = event => {
    event.preventDefault();
    const file = event.target.files[0];
    console.log(event.target.files);
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = () => {
      // this.setState({ buffer: Buffer(reader.result) });
      //   console.log("buffjmnnnnnnnnnnnnnnnnnner", Buffer(reader.result));

      this.hj(Buffer(reader.result));
    };
  };

  hj = async a => {
    await ipfs.add(a, (err, ipfsHash) => {
      console.log(err, ipfsHash);

      this.setState({ aadhar: ipfsHash[0].hash });
    });
  };
  hj = async a => {
    await ipfs.add(a, (err, ipfsHash) => {
      console.log(err, ipfsHash);

      this.setState({ profilepic: ipfsHash[0].hash });
    });
  };
  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = SimpleStorageContract.networks[networkId];
      const instance = new web3.eth.Contract(
        SimpleStorageContract.abi,
        deployedNetwork && deployedNetwork.address
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance }, this.runExample);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  };
  render() {
    return (
      <div>
        <Button
          variant="outlined"
          color="primary"
          onClick={this.ClickOpenGetProfile}
        >
          Sign Up!
        </Button>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">
            <Typography style={{ color: "#1a237e" }} variant="h4">
              Create New Account
            </Typography>
          </DialogTitle>
          <DialogContent>
            <DialogContentText>Enter your Name</DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Name"
              type="text"
              fullWidth
              value={this.state.name}
              onChange={this.setName.bind(this)}
            />
            <br />
            <DialogContentText style={{ marginTop: "15px" }}>
              Upload a picture
            </DialogContentText>
            <Grid container justify="center">
              <img
                src={`https://gateway.ipfs.io/ipfs/${this.state.profilepic}`}
                alt="Your Profile Pic Here"
                style={{ margin: "20px", height: "250px", width: "250px" }}
              />
            </Grid>
            <Button disabled={this.disable()}>
              Browse <input onChange={this.captureFile} type="file" />{" "}
            </Button>
            {/* <Button>Upload </Button> */}
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose.bind(this)} color="primary">
              Cancel
            </Button>
            <Button onClick={this.updateProfile.bind(this)} color="primary">
              Create
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default UploadPage;
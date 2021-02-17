import React, { useState } from 'react';
import ReactDom from 'react-dom';

import '../style/reset.css';
import 'semantic-ui-css/semantic.min.css';
import '../style/global.css';

import {
  Button,
  Checkbox,
  Divider,
  Grid,
  GridRow,
  Header
} from 'semantic-ui-react';

const mainElement = document.createElement('div');
document.body.appendChild(mainElement);

const EnableExitToggle = () => {
  return <Checkbox slider />;
};

const StopAndStart = () => {
  const [clicked, setClicked] = useState(false);
  return (
    <Button
      circular
      inverted
      loading={clicked}
      onClick={() => setClicked(true)}
      size="massive"
      icon="power off"
    />
  );
};

const App = () => {
  return (
    <Grid centered padded>
      <GridRow>
        <Header inverted size="large">
          Lokinet
        </Header>
      </GridRow>
      <GridRow>
        <StopAndStart />
      </GridRow>
      <GridRow>
        <EnableExitToggle />
      </GridRow>

      <Divider />
    </Grid>
  );
};

ReactDom.render(<App />, mainElement);

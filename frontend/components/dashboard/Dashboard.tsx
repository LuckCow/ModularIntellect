import * as React from 'react';
import styled from 'styled-components';
import { createGlobalStyle } from 'styled-components';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ParticleBackground from "./ParticleBackground";
import StarMap from "../pages/StarMap";
import {DashboardButtonData} from "./DashboardButtonData";
import { useNavigate, Outlet  } from 'react-router-dom';
import DashboardButton from './DashboardButton';
import Page from '../pages/Page';
import TaskListWidget from "../pages/TaskListWidget";
import {socket, SocketContext} from '../../services/socket';
import ChainInterface from "../langchain/ChainInterface";
import { StoreContext } from '../../stores/StoreContext';
import ChainExecutionStore from "../../stores/ChainExecutionStore";

const chainExecutionStore = new ChainExecutionStore();

const ParticlesContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
`;

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    padding: 0;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    background-color: #000;
  }
`;

const DashboardContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100vw;
  height: 100vh;
  background: transparent;
`;

const ShipContainer = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  z-index: 1;
`;


const ShipBackground = styled.div`
  width: 100%;
  height: 95%;
  background: url('dist/spaceship.png') no-repeat;
  background-size: 100% 100%;
  background-position: center;
  z-index: -1;
`;


const DashboardInterface = styled.div`
  position: absolute;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 1rem;
  width: 80%;
  height: 80%;
  background: rgba(0, 0, 0, 0.8);
  padding: 1rem;
  border-radius: 10px;
`;

const Helm = () => (
    <Page title="Helm">
        <ChainInterface chainExecutionStore={chainExecutionStore}/>
    </Page>
);


const Placeholder = () => (
  <Page title="Placeholder">
    <div>Placeholder Page</div>
  </Page>
);

const Archive = () => (
  <Page title="Archive">
    <div>Archive Page</div>
  </Page>
);

const Engineering = () => (
  <Page title="Engineering">
    <div>Engineering Page</div>
  </Page>
);

const Vault = () => (
  <Page title="Vault">
    <div>Vault Page</div>
  </Page>
);

const dashboardButtons: DashboardButtonData[] = [
  {
    id: 'star-map',
    title: 'Star Map',
    description: 'Check and modify objectives, tasks, and imperatives',
    widget: () => <TaskListWidget/>,
    page: () => <StarMap/>,
  },
  {
    id: 'helm',
    title: 'Helm',
    description: 'Monitor agent status and execution',
    widget: () => <div>Status Widget</div>,
    page: () => <Helm/>,
  },
  {
    id: 'placeholder',
    title: 'Placeholder',
    description: 'Future functionality',
    widget: () => <div>Status Widget</div>,
    page: () => <Placeholder/>,
  },
  {
    id: 'archive',
    title: 'Archive',
    description: 'Search through logs of past executions',
    widget: () => <div>Status Widget</div>,
    page: () => <Archive/>,
  },
  {
    id: 'engineering',
    title: 'Engineering',
    description: 'Create and edit tools and subagents',
    widget: () => <div>Status Widget</div>,
    page: () => <Engineering/>,
  },
  {
    id: 'vault',
    title: 'Vault',
    description: 'Explore the memory system of the agents',
    widget: () => <div>Status Widget</div>,
    page: () => <Vault/>,
  },
];




const Dashboard = () => {
  const shipContainerRef = React.useRef<HTMLDivElement>(null);
  const shipBackgroundRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const constrain = 2000;

    function transforms(x: number, y: number, el: HTMLElement) {
      const box = el.getBoundingClientRect();
      const calcX = -(y - box.y - box.height / 2) / constrain;
      const calcY = (x - box.x - box.width / 2) / constrain;

      return `perspective(100px) rotateX(${calcX}deg) rotateY(${calcY}deg)`;
    }

    function transformElement(el: HTMLElement, xyEl: [number, number, HTMLElement]) {
      el.style.transform = transforms.apply(null, xyEl);
    }

    const shipContainer = shipContainerRef.current;
    const shipBackground = shipBackgroundRef.current;

    if (shipContainer && shipBackground) {
      shipContainer.onmousemove = function (e) {
        const xy = [e.clientX, e.clientY];
        const position: [number, number, HTMLElement] = [xy[0], xy[1], shipBackground];

        window.requestAnimationFrame(function () {
          transformElement(shipBackground, position);
        });
      };
    }

    return () => {
      if (shipContainer) {
        shipContainer.onmousemove = null;
      }
    };
  }, []);

  return (
      <>
        <div>Dashboard</div>
        <DashboardContainer>
          <ParticlesContainer>
            <ParticleBackground/>
          </ParticlesContainer>
          <ShipContainer ref={shipContainerRef}>
            <ShipBackground ref={shipBackgroundRef} />
            <DashboardInterface>
              {dashboardButtons.map((buttonData) => (
                  <DashboardButton key={buttonData.id} data={buttonData} />
              ))}
            </DashboardInterface>
          </ShipContainer>
          <Outlet />
        </DashboardContainer>
      </>
  );
};


function App() {
  return (
      <div className="App">
      <GlobalStyle />
        <SocketContext.Provider value={{ socket }}>
          <StoreContext.Provider value={{ chainExecutionStore }}>
            <BrowserRouter>
              <Routes>
                <Route path="/*" element={<Dashboard/>}/>
                  {dashboardButtons.map((buttonData) => (
                    <Route key={buttonData.id} path={buttonData.id} element={buttonData.page()} />
                  ))}
              </Routes>
            </BrowserRouter>
            </StoreContext.Provider>
          </SocketContext.Provider>
      </div>
  );
}


export default App;
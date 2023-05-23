import * as React from 'react';
import styled from 'styled-components';
import { createGlobalStyle } from 'styled-components';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ParticleBackground from "./ParticleBackground";
import Tasks from "../pages/Tasks";
import {DashboardButtonData} from "./DashboardButtonData";
import { useNavigate, Outlet  } from 'react-router-dom';
import DashboardButton from './DashboardButton';
import Page from '../pages/Page';
import TaskListWidget from "../pages/TaskListWidget";
import {socket, SocketContext} from '../../services/socket';
import ChainInterface from "../langchain/ChainInterface";
import { StoreContext } from '../../stores/StoreContext';
import ChainExecutionStore from "../../stores/ChainExecutionStore";
import Logs from "../pages/Logs";
import SearchComponent from "../pages/SearchComponent";
import MemorySystemSummary from "../memory/MemorySystemSummary";

import {
    Header,
    Title,
    Container
} from "../../SharedStyles";

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


// const DashboardInterface = styled.div`
//   position: absolute;
//   display: grid;
//   grid-template-columns: repeat(3, 1fr);
//   grid-template-rows: repeat(2, 1fr);
//   gap: 1rem;
//   width: 80%;
//   height: 80%;
//   background: rgba(0, 0, 0, 0.8);
//   padding: 1rem;
//   border-radius: 10px;
// `;

const DashboardInterface = styled.div`
  position: absolute;
  width: 80%;
  height: 80%;
  background: rgba(0, 0, 0, 0.8);
  padding: 1rem;
  border-radius: 10px;
  
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 1rem;
  flex-grow: 1;
  overflow: auto;
`;


const AgentMonitor = () => (
    <Page title="Agent Monitor">
        <ChainInterface chainExecutionStore={chainExecutionStore}/>
    </Page>
);


const Chat = () => (
  <Page title="Chat">
    <div>Chat Interface</div>
  </Page>
);

const Archive = () => (
  <Page title="Console Logs">
    <Logs/>
  </Page>
);

const Engineering = () => (
  <Page title="Engineering">
    <div>Engineering Page</div>
  </Page>
);

const Vault = () => (
  <Page title="Memory Search">
    <SearchComponent/>
  </Page>
);

const dashboardButtons: DashboardButtonData[] = [
  {
    id: 'tasks',
    title: 'Automated Agent Tasks',
    description: 'Check and modify objectives, tasks, and imperatives',
    widget: () => <TaskListWidget/>,
    page: () => <Tasks/>,
  },
  {
    id: 'agent-monitor',
    title: 'Agent Monitor',
    description: 'Monitor agent status and execution',
    widget: () => <div>Agent Status: Idle</div>,  //TODO: Add agent status widget
    page: () => <AgentMonitor/>,
  },
  // {
  //   id: 'chat',
  //   title: 'User Interface',
  //   description: 'Upload documents and ask questions',
  //   widget: () => <div>Chat Window Widget Placeholder</div>,
  //   page: () => <Chat/>,
  // },
  {
    id: 'archive',
    title: 'Console Logs',
    description: 'Review logs of past executions',
    widget: () => <Logs/>,
    page: () => <Archive/>,
  },
  // {
  //   id: 'tools',
  //   title: 'Agent Tools',
  //   description: 'Create and edit tools and subagents',
  //   widget: () => <Logs/>,
  //   page: () => <Engineering/>,
  // },
  {
    id: 'memory',
    title: 'Memory System',
    description: 'Search the memory system of the agent',
    widget: () =>  <MemorySystemSummary
        documents={1000}
        chunks={2000}
        conversations={300}
        responses={1500}
        reflections={500}
        tasks={100}
      />,
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
        <DashboardContainer>
          <ParticlesContainer>
            <ParticleBackground/>
          </ParticlesContainer>
          <ShipContainer ref={shipContainerRef}>
            <ShipBackground ref={shipBackgroundRef} />
            <DashboardInterface>
              <Header>
                <Title>Modular Intellect Dashboard</Title>
              </Header>
              <DashboardGrid>
                {dashboardButtons.map((buttonData) => (
                    <DashboardButton key={buttonData.id} data={buttonData} />
                ))}
              </DashboardGrid>
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
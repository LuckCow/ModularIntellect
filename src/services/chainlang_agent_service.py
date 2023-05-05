from abc import abstractmethod, ABC

from src.components.iagent_service import IAgentService
from src.components.itask import ITask


class BaseChainLangAgent(IAgentService, ABC):
    # TODO: check that this interface is necessary, may be able to to use a ChainLang interface directly

    def __init__(self):
        self._chain = self._get_chain()

    @abstractmethod
    def execute(self, task: ITask):
        #self._chain(task)
        pass

    @abstractmethod
    def _get_chain(self):
        pass
function addUserId({ getState }: { getState: () => any }) {
  return (next: (action: any) => any) => (action: any) => {
    if(!action.payload){
      action.payload={};
    }
    // add userId to all action
    action.payload.userId = getState().users.get('id');
    const returnValue = next(action);
    return returnValue;
  };
}

function addTimeStamp() {
  return (next: (action: any) => any) => (action: any) => {
    if(!action.payload){
      action.payload={};
    }
    // add timestamp:now to all action
    if (!action.payload.now) {
      action.payload.now = Math.floor((new Date()).getTime());
    }
    const returnValue = next(action);
    return returnValue;
  };
}

export default [addUserId, addTimeStamp];

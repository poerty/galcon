function addUserId({ getState }: { getState: () => any }) {
  return (next: (action: any) => any) => (action: any) => {
    // add userId to all action
    action.userId = getState().users.get('id');
    const returnValue = next(action);
    return returnValue;
  };
}

function addTimeStamp() {
  return (next: (action: any) => any) => (action: any) => {
    // add timestamp:now to all action
    if (!action.now) {
      action.now = Math.floor((new Date()).getTime());
    }
    const returnValue = next(action);
    return returnValue;
  };
}

export default [addUserId, addTimeStamp];

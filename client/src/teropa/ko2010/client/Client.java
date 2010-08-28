package teropa.ko2010.client;

import com.google.gwt.core.client.EntryPoint;
import com.google.gwt.user.client.ui.Label;
import com.google.gwt.user.client.ui.RootPanel;

public class Client implements EntryPoint {

	public void onModuleLoad() {
		RootPanel.get().add(new Label("Hello from GWT"));
	}
	
}

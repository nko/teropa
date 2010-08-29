package teropa.ko2010.client;

import com.google.gwt.core.client.GWT;
import com.google.gwt.uibinder.client.UiBinder;
import com.google.gwt.user.client.ui.Composite;
import com.google.gwt.user.client.ui.Widget;

public class Left extends Composite {

	private static LeftUiBinder uiBinder = GWT.create(LeftUiBinder.class);

	interface LeftUiBinder extends UiBinder<Widget, Left> {
	}

	public Left() {
		initWidget(uiBinder.createAndBindUi(this));
	}


}
